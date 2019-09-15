const Jimp = require('jimp');

class CharacterPlaybook {
    static playbooks() {
        return {
            "The Elder" : {
                playbookName: "The Elder",
                characterSheetImage: 'assets/characters/char-the-elder.png',
            },
            "The Envoy" : {
                playbookName: "The Envoy",
                characterSheetImage: 'assets/characters/char-the-envoy.png',
            },
            "The Firebrand" : {
                playbookName: "The Firebrand",
                characterSheetImage: 'assets/characters/char-the-firebrand.png',
            },
            "The Hunter" : {
                playbookName: "The Hunter",
                characterSheetImage: 'assets/characters/char-the-hunter.png',
            },
            "The Machine" : {
                playbookName: "The Machine",
                characterSheetImage: 'assets/characters/char-the-machine.png',
            },
            "The Promethean" : {
                playbookName: "The Promethean",
                characterSheetImage: 'assets/characters/char-the-promethean.png',
            },
            "The Reaver" : {
                playbookName: "The Reaver",
                characterSheetImage: 'assets/characters/char-the-reaver.png',
            },
            "The Remnant" : {
                playbookName: "The Remnant",
                characterSheetImage: 'assets/characters/char-the-remnant.png',
            },
            "The Scavenger" : {
                playbookName: "The Scavenger",
                characterSheetImage: 'assets/characters/char-the-scavenger.png',
            },
            "The Seeker" : {
                playbookName: "The Seeker",
                characterSheetImage: 'assets/characters/char-the-seeker.png',
            },
            "The Sentinel" : {
                playbookName: "The Sentinel",
                characterSheetImage: 'assets/characters/char-the-sentinel.png',
            },
            "The Survivor" : {
                playbookName: "The Survivor",
                characterSheetImage: 'assets/characters/char-the-survivor.png',
            },
            "The Untamed" : {
                playbookName: "The Untamed",
                characterSheetImage: 'assets/characters/char-the-untamed.png',
            },
            "Quick Character" : {
                playbookName: "Quick Character",
                characterSheetImage: `/home/lhayhurst/WebstormProjects/legacybot/assets/characters/char-quick-character.png`
            }
        };
    }

    static find_stock_playbook( playbookName ) {
        let playbooks = Object.keys( CharacterPlaybook.playbooks() );
        for( var i = 0; i < playbooks.length; i++ ) {
            let pbName = playbooks[i];
            if ( pbName.toLowerCase().includes( playbookName.toLowerCase() )) {
                return pbName;
            }
        }
        return null;
    }

    constructor( character_name, playbook_name, guild_id, family_name, force=0, lore=0, steel=0, sway=0 ) {
        this.character_name = character_name;
        this.character_playbook = playbook_name;
        this.guild_id = guild_id;
        this.family_name = family_name;
        this.force = force;
        this.lore = lore;
        this.steel = steel;
        this.sway = sway;
        this.character_username = null;
    }

    static fromNedbDocument(document) {
        let ret = new CharacterPlaybook(document.character_name, document.character_playbook,
            document.guild_id, document.family_name,
            document.force, document.lore, document.steel, document.sway);

        if (document.character_user_id) {
            ret.character_user_id = document.character_user_id;
            ret.character_username = document.character_username;
        }

        return ret;
    }

    get playbook() {
        return this.character_playbook;
    }

    get name() {
        return this.character_name;
    }

    get user_id() {
        return this.character_user_id;
    }

    get username() {
        return this.character_username;
    }

    get family() {
        return this.family_name;
    }

    static get_print_coordinates(item) {
        let print_coordinates = {
            'name': [867, 41],
            'force': [853, 88],
            'lore': [994, 88],
            'steel': [1136, 88],
            'sway': [1280, 88],

        };
        return print_coordinates[item];
    }

    async visit(richEmbed, summary_only=true) {
        if (summary_only) {
            richEmbed
                .addField('Name', this.name, true)
                .addField('Playbook', this.playbook, true)
                .addField('Family', this.family, true)
                .addField('Username', this.username, true)
                .addBlankField()
        } else {
            let playbooks = CharacterPlaybook.playbooks();
            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            if (playbooks[this.playbook]) {
                let pb = playbooks[this.playbook];
                let playbookSheetPath = pb.characterSheetImage;
                let playbookSheetImage = await Jimp.read(playbookSheetPath);
                let name_coordinates = CharacterPlaybook.get_print_coordinates('name');
                await playbookSheetImage.print(font, name_coordinates[0], name_coordinates[1], this.name);

                let stats = [
                    {key: 'force', 'val': this.force},
                    {key: 'lore', 'val': this.lore},
                    {key: 'steel', 'val': this.steel},
                    {key: 'sway', 'val': this.sway}
                ];
                for (var i = 0; i < stats.length; i++) {
                    let stat_item = stats[i];
                    if (stat_item.val) {
                        let coordinates = CharacterPlaybook.get_print_coordinates(stat_item.key);
                        await playbookSheetImage.print(font, coordinates[0], coordinates[1], stat_item.val);
                    }
                }


                let imgBuf = await playbookSheetImage.getBufferAsync(Jimp.AUTO);
                let imageName = `image.png`
                richEmbed.attachFiles([{name: imageName, attachment: imgBuf}]).setImage(`attachment://${imageName}`);
            }
        }
    }
}

module.exports = CharacterPlaybook;