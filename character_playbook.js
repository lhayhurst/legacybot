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




}

module.exports = CharacterPlaybook;