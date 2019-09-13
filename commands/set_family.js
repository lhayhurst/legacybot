const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const {db} = require('../bot')

class SetFamilyCommandReply {
    constructor(args) {
        this.args = args;
    }

    get reply() {
        return true;
    }

}

class SetFamilyCommand extends Command {
    constructor() {
        super('set family command', {
            aliases: ['set-family', 'sf'],
            split: 'quoted',
            args: [
                {
                    id: 'name',
                    split: 'quoted',
                    type: 'string',
                }
            ]
        });
    }

    static reply(args) {
        return new SetFamilyCommandReply(args).reply;
    }

    exec(message, args) {
        db.find({family_name: args.name}).then((docs) => {
            if (docs.length === 0) { //no family found with that name
                return message.reply(`No family found with name ${args.name}!`);
            } else { //it already exists, just let the user know
                let insertedRec = docs[0];
                let vivifiedFamily = FamilyPlaybook.fromNedbDocument(insertedRec);
                let user_id = message.member.user.id;
                if (vivifiedFamily.user && vivifiedFamily.user !== user_id) {
                    return message.reply(`That family is already set to a different user ('${message.member.user.username}') `);
                }
                else if ( vivifiedFamily.user && vivifiedFamily.user === user_id) {
                    return message.reply(`You are already set to the family with name '${vivifiedFamily.name}'`);
                }
                db.update({family_name: vivifiedFamily.name}, {$set: {user_id: user_id, username: message.member.user.username }}, {}, (err, numReplaced) => {
                });
                //message.member.setNickname(vivifiedFamily.playbook);
                return message.reply(`you have set your family to ${vivifiedFamily.playbook} with name '${vivifiedFamily.name}'`);
            }
        }).catch((err) => {
            return message.reply(`Something terrible happened: ${err}`);
        });
    }
}

module.exports = SetFamilyCommand;
