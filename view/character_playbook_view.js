const Jimp = require('jimp');
const DbUtil = require("../commands/dbutil");
const CharacterPlaybook = require('../character_playbook');


class CharacterPlaybookView {
    constructor(richEmbed) {
        this.richEmbed = richEmbed;
    }



    async getFamily(character) {
        let fname = `_none_`;
        if ( character.family ) {
            let family = await DbUtil.get_family_by_object_id(character.family);
            fname = family.name;
        }
        return fname;
    }

    async visitAll(characters) {
        this.richEmbed.setTitle('Characters in this Legacy Game'); //TODO: have bot give the game a name
        for (var i = 0; i < characters.length; i++) {
            let character = characters[i];
            let fname = this.getFamily(character);
            this.richEmbed
                .addField(" Name", character.name, true)
                .addField("Playbook", character.playbook, true)
                .addField("Family", fname, true)
                .addField("Player", character.username, true)
                .addBlankField();
        }
    }

    static get_print_coordinates(item) {
        let print_coordinates = {
            'name': [867, 41],
            'force': [853, 88],
            'lore': [994, 88],
            'steel': [1136, 88],
            'sway': [1280, 88],
            'notes': [61,253]
        };
        return print_coordinates[item];
    }


    async visitCharacter(character, text_output) {
        this.richEmbed.setTitle(`Character Sheet`);

        if (text_output) {
            return await this.outputAsText(character);
        } else {
            return await this.outputAsImage(character);
        }
    }

    async outputAsText(character) {
        let fname = await this.getFamily(character);

        this.richEmbed.setTitle( `\`${character.name}, ${character.playbook} of ${fname}\`` )
            .setDescription(`Notes: ${character.notes}`)
            .addField( 'Force', character.force, true)
            .addField( 'Lore', character.lore, true)
            .addField( 'Steel', character.steel, true)
            .addField( 'Sway', character.sway, true)
            .addBlankField();
        this.richEmbed.setFooter( `Have a bug to file? Needs more help? Visit https://github.com/lhayhurst/legacybot/issues`,
            `https://cdn.discordapp.com/embed/avatars/0.png`);

    }

    async outputAsImage(character) {
        let playbooks = CharacterPlaybook.playbooks();
        let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        if (playbooks[character.playbook]) {
            let pb = playbooks[character.playbook];
            let playbookSheetPath = pb.characterSheetImage;
            let playbookSheetImage = await Jimp.read(playbookSheetPath);
            let name_coordinates = CharacterPlaybookView.get_print_coordinates('name');
            await playbookSheetImage.print(font, name_coordinates[0], name_coordinates[1], character.name);

            let stats = [
                {key: 'force', 'val': character.force},
                {key: 'lore', 'val': character.lore},
                {key: 'steel', 'val': character.steel},
                {key: 'sway', 'val': character.sway}
            ];
            for (var i = 0; i < stats.length; i++) {
                let stat_item = stats[i];
                if (stat_item.val) {
                    let coordinates = CharacterPlaybookView.get_print_coordinates(stat_item.key);
                    await playbookSheetImage.print(font, coordinates[0], coordinates[1], stat_item.val);
                }
            }

            if ( character.notes ) {
                let notesFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
                let notesCoordinates = CharacterPlaybookView.get_print_coordinates('notes');
                await playbookSheetImage.print( notesFont, notesCoordinates[0], notesCoordinates[1], character.notes, 600 );
            }


            let imgBuf = await playbookSheetImage.getBufferAsync(Jimp.AUTO);
            let imageName = `image.png`
            this.richEmbed.attachFiles([{name: imageName, attachment: imgBuf}]).setImage(`attachment://${imageName}`);
        }
    }
}

module.exports = CharacterPlaybookView;