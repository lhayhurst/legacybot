const Jimp = require('jimp');
const FamilyPlaybook = require('../family_playbook');

class FamilyPlaybookView {
    constructor( fpmodel ) {
        this.fplaybook = fpmodel;
    }

    async visit( richEmbed, summary_only=true ) {
        if (summary_only) {
            richEmbed
                .addField('Name', this.fplaybook.name, true)
                .addField('Playbook', this.fplaybook.playbook, true)
                .addField('Player', this.fplaybook.managed_by_username, true)
                .addBlankField()
        }
        else {
            let imagesToPublish = [];
            let playbooks = FamilyPlaybook.playbooks();
            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

            //check to see if a name page should be inserted (if playing one of the stock families)
            if (playbooks[this.fplaybook.playbook]) {
                let pb = playbooks[this.fplaybook.playbook];
                let playbookSheetPath = pb.familySheetImage;
                let playbookSheetImage = await Jimp.read(playbookSheetPath);
                let name_coordinates = FamilyPlaybook.get_print_coordinates('family_name');
                await playbookSheetImage.print(font, name_coordinates[0], name_coordinates[1], this.fplaybook.name);

                if ( this.fplaybook.notes ) {
                    let notesFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                    let notesCoordinates = FamilyPlaybook.get_print_coordinates('notes');
                    await playbookSheetImage.print( notesFont, notesCoordinates[0], notesCoordinates[1], this.fplaybook.notes, 600 );
                }

                imagesToPublish.push(playbookSheetImage);

            }



            let statsSheetImage = await Jimp.read('assets/families/family-sheet-2.png');


            let stats = [
                {key: 'reach', 'val': this.fplaybook.reach},
                {key: 'grasp', 'val': this.fplaybook.grasp},
                {key: 'sleight', 'val': this.fplaybook.sleight},
                {key: 'mood', 'val': this.fplaybook.mood},
                {key: 'family_data', 'val': this.fplaybook.data_resource},
                {key: 'tech', 'val': this.fplaybook.tech},

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
            if ( this.fplaybook.treaties ) {
                let treatyFamilies = Object.keys(this.treaties);
                for (var k = 0; k < treatyFamilies.length; k++) {
                    let familyName = treatyFamilies[k];
                    let treaties = this.fplaybook.treaties[familyName];
                    let yoursOnThem = treaties.me_on;
                    let themOnMe = treaties.on_me;
                    await statsSheetImage.print(font, treatyStartCoord[0], startYCoordinate, familyName);
                    await statsSheetImage.print(font, yoursOnThemCoord[0], startYCoordinate, yoursOnThem);
                    await statsSheetImage.print(font, theirsOnYouCoord[0], startYCoordinate, themOnMe);
                    startYCoordinate += 40;
                }
            }

            //and finally the surpluses and needs
            if ( this.fplaybook.surpluses) {
                let surplusesCoordinates = FamilyPlaybook.get_print_coordinates('surpluses');
                let surplusStartYCoord = surplusesCoordinates[1];
                for (var l = 0; l < this.fplaybook.surpluses.length; l++) {
                    await statsSheetImage.print(font, surplusesCoordinates[0], surplusStartYCoord, this.surpluses[l]);
                    surplusStartYCoord += 40;
                }
            }

            if( this.fplaybook.needs ) {
                let needsCoordinates = FamilyPlaybook.get_print_coordinates('needs');
                let needsStartYCoord = needsCoordinates[1];
                for (var m = 0; m < this.fplaybook.needs.length; m++) {
                    await statsSheetImage.print(font, needsCoordinates[0], needsStartYCoord, this.needs[m]);
                    needsStartYCoord += 40;
                }
            }

            imagesToPublish.push(statsSheetImage);

            for (var j = 0; j < imagesToPublish.length; j++) {
                let image = imagesToPublish[j];
                let imgBuf = await image.getBufferAsync(Jimp.AUTO);
                let imageName = `image-${j}.png`
                richEmbed.attachFiles([{name: imageName, attachment: imgBuf}]).setImage(`attachment://${imageName}`);

            }

        }
    }
}

module.exports = FamilyPlaybookView;