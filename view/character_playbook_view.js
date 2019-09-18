const Jimp = require('jimp');
const FamilyPlaybook = require('../family_playbook');
const DbUtil = require("../commands/dbutil");


class CharacterPlaybookView {
    constructor(richEmbed) {
        this.richEmbed = richEmbed;
    }

    async visitAll(characters) {
        this.richEmbed.setTitle('Characters in this Legacy Game'); //TODO: have bot give the game a name
        for (var i = 0; i < characters.length; i++) {
            let character = characters[i];
            let fname = `_none_`;
            if ( character.family ) {
                let family = await DbUtil.get_family_by_object_id(character.family);
                fname = family.name;
            }
            this.richEmbed
                .addField(" Name", character.name, true)
                .addField("Playbook", character.playbook, true)
                .addField("Family", fname, true)
                .addField("Player", character.username, true)
                .addBlankField();
        }
    }

    async visitCharacter() {
        this.richEmbed.setTitle(`Character Sheet`);
    }
}

module.exports = CharacterPlaybookView;