const {Command} = require('discord-akairo');
const {db} = require('../bot');


class SetFamilyStatsCommandReply {
    constructor(args, user_id) {
        this.args = args;
        this.user_id = user_id;
    }

    get reply() {
        //first check to see if the user has set their family
    }
}

class SetFamilyStatsCommand extends Command {
    constructor() {
        super('setfamstats', {
            aliases: ['set-family-stats', 'sfs'],
            match: 'none',
            args: [
                {
                    id: 'reach',
                    match: 'prefix',
                    prefix: 'r=',
                    type: 'int',
                },
                {
                    id: 'sleight',
                    match: 'prefix',
                    prefix: 's=',
                    type: 'int',
                },
                {
                    id: 'grasp',
                    match: 'prefix',
                    prefix: 'g=',
                    type: 'int',
                },
                {
                    id: 'family_data',
                    match: 'prefix',
                    prefix: 'd=',
                    type: 'int',
                },
                {
                    id: 'tech',
                    match: 'prefix',
                    prefix: 't=',
                    type: 'int',
                },
                {
                    id: 'mood',
                    match: 'prefix',
                    prefix: 'm=',
                    type: 'int',
                }


            ]
        });
    }

    static updateStat(id, update_object) {
    }


    exec(message, args) {
        let user_id = message.member.user.id;

        let statsToUpdate = {};
        let id_to_update = {};

        db.find({user_id: user_id}).then((docs) => {
            if (docs.length === 0) {
                return message.reply(`You have not set your family set -- please run "/set-family 'family name'" first!`);
            }
            let id = docs[0]._id;
            if (args.reach) {
                statsToUpdate.reach = args.reach;
            }
            if (args.sleight) {
                statsToUpdate.sleight = args.sleight;
            }
            if (args.grasp) {
                statsToUpdate.grasp = args.grasp;
            }
            if (args.family_data) {
                statsToUpdate.family_data = args.family_data;
            }
            if (args.tech) {
                statsToUpdate.tech = args.tech;
            }
            if (args.mood) {
                statsToUpdate.mood = args.mood;
            }

            db.update( {_id: id}, {$set: statsToUpdate}, [ ]).then((updatedDocs) => {
                return message.reply(`Updated your family "${docs[0].family_name}" with new stats ${JSON.stringify(statsToUpdate)}`)
            }).catch((err) => {
                return message.reply(`Something bad happened: ${err}`);
            });
        }).
        catch((err) => {
            return message.reply(`Something bad happened: ${err}`);
        });
    }
}

module.exports = SetFamilyStatsCommand;
