const Jimp = require('jimp');


class FamilyPlaybookGameData {

    static playbooks() {
        return {
            'The Synthetic Hive': {
                playbookName: 'The Synthetic Hive',
                familySheetImage: 'assets/families/synthetic-hive.png',
                treatyRules: `When a Family or Faction comes freely to you to ask for support or trade, gain 1-Treaty on them on top of any deals you make.`,
                statsChoices: [
                    {
                        id: 1,
                        choice: "If the Homeland's power infrastructure has been decimated",
                        consequence: {reach: 0, grasp: -1, sleight: 2}
                    },
                    {
                        id: 2,
                        choice: "If the Fall preserved much of the Homeland's power infrastructure",
                        consequence: {reach: 1, grasp: 0, sleight: 0}
                    },
                    {
                        id: 3,
                        choice: "If the Homeland is nothing but artificial infrastructure, ravaged by the Fall",
                        consequence: {reach: 0, grasp: 3, sleight: -1}
                    },

                ],
                doctrineChoices: [
                ]

            },
            'The Enclave of Bygone Lore': {
                playbookName: 'The Enclave of Bygone Lore',
                familySheetImage: 'assets/families/enclave-of-bygone-lore.png',
                treatyRules: `When you spend time and effort showing another group how to use their technology better, gain 1-Treaty on them`,
                statsChoices: [],
                doctrineChoices: [
                    {
                        id: 1,
                        choice: "Shepherds of Humanity: Your factories could rebuild civilization from scratch, if given the proper blueprints. You can spend 2-Data to manufacture 3-Tech.",
                        consequence: function (family_playbook) {
                            family_playbook.data_stat -= 2;
                            family_playbook.tech += 3
                        }
                    },
                    {
                        id: 2,
                        choice: "Axioms of Order: The Hive’s directive is to bring harmony and discipline to the world. You have Advantage on Hold Together.",
                        consequence: function (family_playbook) {
                            family_playbook.advantages_rolls["HoldTogether"] = true;
                        }
                    },
                    {
                        id: 3,
                        choice: "Guardians of the Singularity: you always know how much Tech other Families and Factions have in store. Whenever an Unleash Power rouses devices in the environment, gain 1 Data.",
                        consequence: function (family_playbook) {
                            return true; //up to the player to remember this one I guess?
                        },
                    }

                ]
            },
            'The Servants of One Truth Faith': {
                playbookName: 'The Servants of One Truth Faith',
                familySheetImage: 'assets/families/servants-of-the-one-truth-faith.png',
                treatyRules: `When you publicly condemn another group for their sins, hold 1. Publicly absolve them of those same sins and spend that hold to gain 1-Treaty on them. You can only have 1 hold at a time.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Cultivators of the New Flesh': {
                playbookName: 'The Cultivators of the New Flesh',
                familySheetImage: 'assets/families/cultivators-of-the-new-flesh.png',
                treatyRules: `When you freely give someone the perfect resource to solve a problem, gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Gilded Company of Merchants': {
                playbookName: 'The Gilded Company of Merchants',
                familySheetImage: 'assets/families/the-gilded-company-of-merchants.png',
                treatyRules: `When you make another group part of your trading operations (suppliers, distributors or vendors) gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Law Givers of the Wasteland': {
                playbookName: 'The Law Givers of the Wasteland',
                familySheetImage: 'assets/families/lawgivers-of-the-wasteland.png',
                treatyRules: `When you bring another Family's or Faction's hated foe to justice, your Family gains 2-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Order of the Titan': {
                playbookName: 'The Order of the Titan',
                familySheetImage: 'assets/families/order-of-the-titan.png',
                treatyRules: `When you Lend Aid to a group under a Kaiju Threat Alert, gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Pioneers of the Depths': {
                playbookName: 'The Pioneers of the Depths',
                familySheetImage: 'assets/families/pioneers-of-the-depths.png',
                treatyRules: `When you trade a Family a Surplus harvested from the sea for one harvested from the Land, gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Stranded Starfarers': {
                playbookName: 'The Stranded Starfarers',
                familySheetImage: 'assets/families/stranded-starfarers.png',
                treatyRules: `Your origin gives you a different perspective on the world. When you Uncover Secrets to reveal something that helps a Family, gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Tyrant Kings': {
                playbookName: 'The Tyrant Kings',
                familySheetImage: 'assets/families/tyrant-kings.png',
                treatyRules: `When you give another Family a position of power in your empire's hierarchy, gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            },
            'The Uplifted Children of Mankind': {
                playbookName: 'The Uplifted Children of Mankind',
                familySheetImage: 'assets/families/uplifted-children-of-mankind.png',
                treatyRules: `When someone adopts your customs --wther on the primal or sapient side -- gain 1-Treaty on them.`,
                statsChoices: [],
                doctrineChoices: [],
            }
        };
    }

    static find_stock_playbook( playbookName ) {
        let playbooks = Object.keys( FamilyPlaybookGameData.playbooks() );
        for( var i = 0; i < playbooks.length; i++ ) {
            let pbName = playbooks[i];
            if ( pbName.toLowerCase().includes( playbookName.toLowerCase() )) {
                return pbName;
            }
        }
        return null;
    }

    static get_print_coordinates(stat) {
        let print_coordinates = {
            'reach': [148, 38],
            'grasp': [365, 38],
            'sleight': [573, 38],
            'tech': [553, 880],
            'family_data': [361, 880],
            'mood': [172, 880],
            'treaty': [231, 97],
            'family_name': [849, 153],
            'treaties': {start: [50, 203], yoursOnThem: [311, 203], theirsOnYou: [478, 203]},
            'surpluses': [50, 559],
            'needs': [348, 559],
            'notes': [738, 276]
        };
        return print_coordinates[stat];
    }

    static get_treaty_coordinates_and_text(playbook_name) {
        let playbooks = FamilyPlaybookGameData.playbooks();
        if (!playbooks[playbook_name]) {
            return null;
        }
        let coordinates = FamilyPlaybookGameData.get_print_coordinates('treaty');
        let text = playbooks[playbook_name].treatyRules;
        return {coordinates: coordinates, treaty_text: text};

    }

}

module.exports = FamilyPlaybookGameData;