const Jimp = require('jimp');
const FamilyPlaybook = require('../family_playbook');
const DbUtil = require("../commands/dbutil");
const PropertyMagic = require('../commands/property_magic');

class FamilyPlaybookView {
    constructor( richEmbded ) {
        this.richEmbed = richEmbded;
    }

    async visitTreaties( family,richEmbed ) {
        richEmbed.setTitle(`${ family.name}\'s Treaties`);
        if (family.treaties) {
            for( const familyPlaybookName of family.treaties.keys() ) {
                let tf = await DbUtil.get_family_by_playbook(familyPlaybookName, family.guild_id );
                if ( tf ) {
                    richEmbed
                        .addField("Family Name", tf.name, true)
                        .addField("Me on Them",  family.findTreatyWith(tf), true)
                        .addField("Them on Me",  tf.findTreatyWith(family), true)
                        .addBlankField();
                }
            }
        }
    }

    async outputAsText(family) {

        this.richEmbed.setTitle( `\'${family.name} -  ${family.playbook}\'` );
        let familyProps = Object.values( PropertyMagic.FamilyProperties() );

        for( var i =0; i < familyProps.length; i++ ) {
            let prop = familyProps[i];
            let propVal = family.get( prop.name );
            if ( propVal != null ) {
                if (prop.isa == 'Array') {
                    this.richEmbed.addField(prop.name, `\`\`\`${JSON.stringify(propVal)}\`\`\``);
                }
                else {
                    this.richEmbed.addField(prop.name, propVal, true);
                }
            }
            else {
                this.richEmbed.addField(prop.name, "null");
            }
        }
        this.richEmbed.setFooter( `Have a bug to file? Needs more help? Visit https://github.com/lhayhurst/legacybot/issues`,
            `https://cdn.discordapp.com/embed/avatars/0.png`);

    }


    async visitAll( families ) {
        for( var i = 0; i < families.length; i++ ) {
            let family = families[i];
            this.richEmbed
                .addField('Name', family.name, true)
                .addField('Playbook', family.playbook, true)
                .addField('Player', family.managed_by_username, true)
                .addBlankField()
        }
    }

    async visitFamily( family, image_mode=false ) {
        if ( !image_mode ) {
            return this.outputAsText(family);
        }

        let imagesToPublish = [];
        let playbooks = FamilyPlaybook.playbooks();
        let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        //check to see if a name page should be inserted (if playing one of the stock families)
        if (playbooks[family.playbook]) {
            let pb = playbooks[family.playbook];
            let playbookSheetPath = pb.familySheetImage;
            let playbookSheetImage = await Jimp.read(playbookSheetPath);
            let name_coordinates = FamilyPlaybook.get_print_coordinates('family_name');
            await playbookSheetImage.print(font, name_coordinates[0], name_coordinates[1], family.name);

            if ( family.notes ) {
                let notesFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                let notesCoordinates = FamilyPlaybook.get_print_coordinates('notes');
                await playbookSheetImage.print( notesFont, notesCoordinates[0], notesCoordinates[1], family.notes, 600 );
            }

            imagesToPublish.push(playbookSheetImage);

        }

        let statsSheetImage = await Jimp.read('assets/families/family-sheet-2.png');


        let stats = [
            {key: 'reach', 'val': family.reach},
            {key: 'grasp', 'val': family.grasp},
            {key: 'sleight', 'val': family.sleight},
            {key: 'mood', 'val': family.mood},
            {key: 'family_data', 'val': family.data_resource},
            {key: 'tech', 'val': family.tech},

        ];
        for (var i = 0; i < stats.length; i++) {
            let stat_item = stats[i];
            if (stat_item.val !== null) {
                let coordinates = FamilyPlaybook.get_print_coordinates(stat_item.key);
                await statsSheetImage.print(font, coordinates[0], coordinates[1], stat_item.val);
            }
        }

        let treaty_coordinates = FamilyPlaybook.get_treaty_coordinates_and_text(this.playbook);
        if (treaty_coordinates) {
            let treaty_font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            await statsSheetImage.print(treaty_font, treaty_coordinates.coordinates[0], treaty_coordinates.coordinates[1], treaty_coordinates.treaty_text, 425);
        }

        let family_treaty_coordinates = FamilyPlaybook.get_print_coordinates('treaties');
        let treatyStartCoord = family_treaty_coordinates.start;
        let yoursOnThemCoord = family_treaty_coordinates.yoursOnThem;
        let theirsOnYouCoord = family_treaty_coordinates.theirsOnYou;

        let startYCoordinate = treatyStartCoord[1];
        if ( family.treaties ) {
            for (const familyName of family.treaties.keys() ) {
                let sfamily = await DbUtil.get_family_by_playbook(familyName,  family.guild_id );
                let yoursOnThem = family.findTreatyWith(family);
                let themOnMe = sfamily.findTreatyWith(family);
                await statsSheetImage.print(font, treatyStartCoord[0], startYCoordinate, sfamily.name);
                await statsSheetImage.print(font, yoursOnThemCoord[0], startYCoordinate, yoursOnThem);
                await statsSheetImage.print(font, theirsOnYouCoord[0], startYCoordinate, themOnMe);
                startYCoordinate += 40;
            }
        }

        //and finally the surpluses and needs
        if ( family.surpluses) {
            let surplusesCoordinates = FamilyPlaybook.get_print_coordinates('surpluses');
            let surplusStartYCoord = surplusesCoordinates[1];
            for (var l = 0; l < family.surpluses.length; l++) {
                await statsSheetImage.print(font, surplusesCoordinates[0], surplusStartYCoord, family.surpluses[l]);
                surplusStartYCoord += 40;
            }
        }

        if( family.needs ) {
            let needsCoordinates = FamilyPlaybook.get_print_coordinates('needs');
            let needsStartYCoord = needsCoordinates[1];
            for (var m = 0; m < family.needs.length; m++) {
                await statsSheetImage.print(font, needsCoordinates[0], needsStartYCoord, family.needs[m]);
                needsStartYCoord += 40;
            }
        }

        imagesToPublish.push(statsSheetImage);

        for (var j = 0; j < imagesToPublish.length; j++) {
            let image = imagesToPublish[j];
            let imgBuf = await image.getBufferAsync(Jimp.AUTO);
            let imageName = `image-${j}.png`
            this.richEmbed.attachFiles([{name: imageName, attachment: imgBuf}]).setImage(`attachment://${imageName}`);

        }
    }
}

module.exports = FamilyPlaybookView;