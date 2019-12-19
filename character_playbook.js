const Jimp = require('jimp');

class CharacterPlaybook {
    static playbooks() {
        return {
            "The Beacon" : {
                playbookName: "The Beacon",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },

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
            "The Foundling" : {
                playbookName: "The Foundling",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },
            "The Hellion" : {
                playbookName: "The Hellion",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },
            "The Herald" : {
                playbookName: "The Herald",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },

            "The Historian" : {
                playbookName: "The Historian",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },

            "The Hunter" : {
                playbookName: "The Hunter",
                characterSheetImage: 'assets/characters/char-the-hunter.png',
            },
            "The Matchmaker" : {
                playbookName: "The Matchmaker",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },

            "The Machine" : {
                playbookName: "The Machine",
                characterSheetImage: 'assets/characters/char-the-machine.png',
            },
            "The Martyr" : {
                playbookName: "The Martyr",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },
            "The Prodigy" : {
                playbookName: "The Prodigy",
                characterSheetImage: `assets/characters/char-quick-character.png`,
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
            "The Road Warrior" : {
                playbookName: "The Road Warrior",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },
            "The Saint" : {
                playbookName: "The Saint",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },
            "The Scavenger" : {
                playbookName: "The Scavenger",
                characterSheetImage: 'assets/characters/char-the-scavenger.png',
            },
            "The Scout" : {
                playbookName: "The Scout",
                characterSheetImage: `assets/characters/char-quick-character.png`,
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
            "The Warlock" : {
                playbookName: "The Warlock",
                characterSheetImage: `assets/characters/char-quick-character.png`,
            },
            "Quick Character" : {
                playbookName: "Quick Character",
                characterSheetImage: `assets/characters/char-quick-character.png`
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




}

module.exports = CharacterPlaybook;