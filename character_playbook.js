
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

    constructor( character_name, playbook_name, guild_id, family_name ) {
        this.character_name = character_name;
        this.character_playbook = playbook_name;
        this.guild_id = guild_id;
        this.family_name = family_name;
    }

    static fromNedbDocument(document) {
        let ret = new CharacterPlaybook(document.character_name, document.character_playbook, document.guild_id, document.family_name);

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
}

module.exports = CharacterPlaybook;