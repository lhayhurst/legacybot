const Jimp = require('jimp');


class FamilyPlaybook {

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
        let playbooks = Object.keys( FamilyPlaybook.playbooks() );
        for( var i = 0; i < playbooks.length; i++ ) {
            let pbName = playbooks[i];
            if ( pbName.includes( playbookName )) {
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
            'needs': [348, 559]
        };
        return print_coordinates[stat];
    }

    static get_treaty_coordinates_and_text(playbook_name) {
        let playbooks = FamilyPlaybook.playbooks();
        if (!playbooks[playbook_name]) {
            return null;
        }
        let coordinates = FamilyPlaybook.get_print_coordinates('treaty');
        let text = playbooks[playbook_name].treatyRules;
        return {coordinates: coordinates, treaty_text: text};

    }

    constructor(playbook, guild_id) {
        this.family_playbook = playbook;
        this.guild_id = guild_id;
        this.advantagesRolls = {};
        this.treaties = {};
        this.surpluses = [];
        this.needs = [];
    }

    get playbook() {
        return this.family_playbook;
    }

    static fromNedbDocument(document) {
        let ret = new FamilyPlaybook(document.family_playbook);
        //TODO: this there some fancy field wise copy I can do here?
        ret.name = document.family_name;
        ret.reach = document.reach;
        ret.grasp = document.grasp;
        ret.sleight = document.sleight;
        ret.family_data = document.family_data; //data is reserved
        ret.family_tech = document.tech;
        ret.mood = document.mood;
        ret.advantages_rolls = document.advantages_rolls;
        ret.guild_id = document.guild_id;
        ret.user = document.user;
        ret.treaties = document.treaties;
        ret.needs = document.needs;
        ret.surpluses = document.surpluses;

        if (document.user_id) {
            ret.user_id = document.user_id;
            ret.username = document.username;
        }

        return ret;
    }

    get user_id() {
        return this.playbook_user_id;
    }

    set user_id(userid) {
        this.playbook_user_id = userid;
    }

    set username(user_name) {
        this.playbook_username = user_name;
    }

    get username() {
        return this.playbook_username;
    }

    addSurplus(resource) {
        if (!this.surpluses) {
            this.surpluses = [];
        }

        if (this.surpluses.indexOf(resource) === -1) {
            this.surpluses.push(resource);
        }
    }

    removeSurplus(resource) {
        if (!this.surpluses) {
            this.surpluses = [];
        }

        let index = this.surpluses.indexOf(resource);
        if (index > -1) {
            this.surpluses.splice(index, 1);
        }
    }

    addNeed(resource) {
        if (!this.needs) {
            this.needs = [];
        }

        if (this.needs.indexOf(resource) === -1) {
            this.needs.push(resource);
        }
    }

    removeNeed(resource) {
        if (!this.needs) {
            this.needs = [];
        }

        let index = this.needs.indexOf(resource);
        if (index > -1) {
            this.needs.splice(index, 1);
        }
    }


    initTreatyFor(targetFamily) {
        if (!this.treaties[targetFamily.name]) {
            this.treaties[targetFamily.name] = {}
            this.treaties[targetFamily.name].on_me = 0;
            this.treaties[targetFamily.name].me_on = 0;
        }
    }


    giveTreatyTo(targetFamily, bonus=1) {
        this.initTreatyFor(targetFamily);
        targetFamily.initTreatyFor(this);
        this.treaties[targetFamily.name].on_me += bonus;
        targetFamily.treaties[this.name].me_on += bonus;
    }

    receiveTreatyFrom(targetFamily, bonus=1) {
        this.initTreatyFor(targetFamily);
        targetFamily.initTreatyFor(this);
        this.treaties[targetFamily.name].me_on += bonus;
        targetFamily.treaties[this.name].on_me += bonus;

    }

    hasTreatyWith(targetFamily) {
        let treaties = this.treaties[targetFamily.name];
        if (!treaties) {
            return false;
        }
        if (!(treaties.on_me > 0 || treaties.me_on > 0)) {
            return false;
        }
        return true;
    }

    spendsTreatyWith(targetFamily) {
        if (this.hasTreatyWith(targetFamily)) {
            this.treaties[targetFamily.name].me_on--;
            targetFamily.treaties[this.name].on_me--;
        }
    }

    visitTreaties(richEmbed) {
        richEmbed.setTitle('Your Treaties');
        if (this.treaties) {
            let families = Object.keys(this.treaties);
            for (var i = 0; i < families.length; i++) {
                let family = families[i];
                let treaties = this.treaties[family];
                richEmbed
                    .addField("Family Name", family, true)
                    .addField("Me on Them", treaties.me_on, true)
                    .addField("Them on Me", treaties.on_me, true)
                    .addBlankField();
            }
        }
    }

    async visit(richEmbed, summary_only = true) {
        if (summary_only) {
            richEmbed
                .addField('Family Name', this.name, true)
                .addField('Family Playbook', this.playbook, true)
                .addField('Username', this.username, true)
                .addBlankField()
                .addBlankField()
        } else {
            let imagesToPublish = [];
            let playbooks = FamilyPlaybook.playbooks();
            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

            //check to see if a name page should be inserted (if playing one of the stock families)
            if (playbooks[this.playbook]) {
                let pb = playbooks[this.playbook];
                let playbookSheetPath = pb.familySheetImage;
                let playbookSheetImage = await Jimp.read(playbookSheetPath);
                let name_coordinates = FamilyPlaybook.get_print_coordinates('family_name');
                await playbookSheetImage.print(font, name_coordinates[0], name_coordinates[1], this.name);
                imagesToPublish.push(playbookSheetImage);
            }

            let statsSheetImage = await Jimp.read('assets/families/family-sheet-2.png');


            let stats = [
                {key: 'reach', 'val': this.reach},
                {key: 'grasp', 'val': this.grasp},
                {key: 'sleight', 'val': this.sleight},
                {key: 'mood', 'val': this.mood},
                {key: 'family_data', 'val': this.data_stat},
                {key: 'tech', 'val': this.tech},

            ];
            for (var i = 0; i < stats.length; i++) {
                let stat_item = stats[i];
                if (stat_item.val) {
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
            let treatyFamilies = Object.keys(this.treaties);
            for (var k = 0; k < treatyFamilies.length; k++) {
                let familyName = treatyFamilies[k];
                let treaties = this.treaties[familyName];
                let yoursOnThem = treaties.me_on;
                let themOnMe = treaties.on_me;
                await statsSheetImage.print(font, treatyStartCoord[0], startYCoordinate, familyName);
                await statsSheetImage.print(font, yoursOnThemCoord[0], startYCoordinate, yoursOnThem);
                await statsSheetImage.print(font, theirsOnYouCoord[0], startYCoordinate, themOnMe);
                startYCoordinate += 40;

            }

            //and finally the surpluses and needs
            let surplusesCoordinates = FamilyPlaybook.get_print_coordinates('surpluses');
            let surplusStartYCoord = surplusesCoordinates[1];
            for (var l = 0; l < this.surpluses.length; l++) {
                await statsSheetImage.print(font, surplusesCoordinates[0], surplusStartYCoord, this.surpluses[l]);
                surplusStartYCoord += 40;
            }

            let needsCoordinates = FamilyPlaybook.get_print_coordinates('needs');
            let needsStartYCoord = needsCoordinates[1];
            for (var m = 0; m < this.needs.length; m++) {
                await statsSheetImage.print(font, needsCoordinates[0], needsStartYCoord, this.needs[m]);
                needsStartYCoord += 40;
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

    get name() {
        return this.family_name;
    }

    set name(nameStr) {
        this.family_name = nameStr;
    }

    set reach(reachValue) {
        this.family_reach = reachValue;
    }

    get reach() {
        return this.family_reach;
    }

    get data_stat() {
        return this.family_data;
    }

    set data_stat(stat_value) {
        this.family_data = stat_value;
    }

    get mood() {
        return this.family_mood;
    }

    set mood(mood) {
        this.family_mood = mood;
    }

    get tech() {
        return this.family_tech;
    }

    set tech(tech_value) {
        this.family_tech = tech_value;
    }


}

module.exports = FamilyPlaybook;