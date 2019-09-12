const {Command} = require('discord-akairo');
const {db} = require('../bot')

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
                }
            ]
        });
    }

    exec(message, args) {
        let user_id = message.member.user.id;
        db.find({user_id: user_id}).then((docs) => {

            //there is some feature envy here -- TODO this function should live in db.js and have tests
            function updateStat(id, update_object) {
                db.update({_id: id},
                    {$set: update_object}, (err, numReplaced) => {
                        if (err) {
                            throw new Error(err);
                        }
                    });
            }

            if (docs.length === 0) {
                return message.reply(`You have not set your family set -- please run "/set-family 'family name'" first!`);
            }
            let id = docs[0]._id;
            if (args.reach) {
                updateStat(id, {reach: args.reach});
            }
            if (args.sleight) {
                updateStat(id, {sleight: args.sleight});
            }
            if (args.grasp) {
                updateStat(id, {grasp: args.grasp})
            }
            return message.reply('updated your family stats');
        }).catch((err) => {
                return message.reply(`Something bad happened: ${err}`);
            });
        }
    }

    module
.
    exports = SetFamilyStatsCommand;
