const Jimp = require('jimp');
const uuidv1 = require('uuid/v1');

class FamilyPlaybook {

    static playbooks() {
        return {
            'The Synthetic Hive': {
                playbookName: 'The Synthetic Hive',
                familySheetPageTwoImage: 'assets/family-sheet-2.png',
                familySheetTreatyText: 'assets/family-treaty.png',
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

            }
        };
    }

    static get_print_coordinates ( stat ) {
        let print_coordinates = {
            'reach': [148, 38],
            'grasp': [365, 38],
            'sleight': [573, 38],
            'tech': [553, 880],
            'family_data': [361, 880],
            'mood': [172, 880]
        };

        return print_coordinates[stat];
    }

    constructor(playbook, guild_id) {
        this.family_playbook = playbook;
        this.guild_id = guild_id;
        this.advantagesRolls = {};
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

    async visit(richEmbed, summary_only=true) {
        if (summary_only) {
            richEmbed
                .addField('Family Name', this.name, true)
                .addField('Family Playbook', this.playbook, true)
                .addField('Username', this.username, true)
                .addBlankField()
                .addBlankField()
        } else {
            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            let image = await Jimp.read('assets/family-sheet-2.png');


            let stats = [
                { key: 'reach', 'val': this.reach },
                { key: 'grasp', 'val': this.grasp },
                { key: 'sleight', 'val': this.sleight },
                { key: 'mood', 'val': this.mood },
                { key: 'family_data', 'val': this.data_stat },
                { key: 'tech', 'val': this.tech },

            ];
            for( var i = 0; i < stats.length; i++ ) {
                let stat_item = stats[i];
                if (stat_item.val) {
                    let coordinates = FamilyPlaybook.get_print_coordinates(stat_item.key);
                    await image.print(font, coordinates[0], coordinates[1], stat_item.val);
                }
            }
            let imgBuf = await image.getBufferAsync(Jimp.AUTO);
            richEmbed.attachFiles([{name: "image.png", attachment: imgBuf}]).setImage('attachment://image.png')
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