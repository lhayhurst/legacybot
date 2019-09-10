const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const {db} = require('../bot')

class NewFamilyCommandReply {
    constructor(args) {
        this.args = args;
        let newFam = new FamilyPlaybook(this.args.playbook);
        newFam.name = this.args.name;
        this.newFamily = newFam;
    }

    get reply() {

        let supportString = null;
        if (this.args.playbook in FamilyPlaybook.playbooks() === false) {
            supportString = 'unsupported';
        } else {
            supportString = 'supported';
        }
        let ret = `I created a new family named "${this.newFam.name}" with ${supportString} playbook "${this.newFam.playbook}"`;
        return ret;
    }

    get newFamily() {
        return this.newFam;
    }

    set newFamily(family) {
        this.newFam = family;
    }

}

class NewFamilyCommand extends Command {
    constructor() {
        super('newfam', {
            aliases: ['new-family', 'nf'],
            split: 'quoted',
            args: [
                {
                    id: 'playbook',
                    split: 'quoted',
                    type: 'string',
                },
                {
                    id: 'name',
                    match: 'prefix',
                    prefix: '--name=',
                    default: null
                }
            ]
        });
    }

    static reply(args) {
        return new NewFamilyCommandReply(args).reply;
    }

    exec(message, args) {
        let newFamilyCommandReply = new NewFamilyCommandReply(args);
        db.find({ family_name : args.name }).then((docs) => {
            if (docs.length === 0) { //its a new family!
                db.insert(newFamilyCommandReply.newFamily)
                    .then( () => {
                        console.log("inserted ok");
                    })
                    .catch( (err) => {
                        console.log(`insert failed! ${err}`);
                    });
                return message.reply(newFamilyCommandReply.reply);
            }
            else { //it already exists, just let the user know
                let insertedRec = docs[0];
                let vivifiedFamily = FamilyPlaybook.fromNedbDocument(insertedRec);
                return message.reply(`That family already exists, here is its info: ${JSON.stringify(vivifiedFamily)}`);
            }
        }).catch((err) => {
            return message.reply(`Something terrible happened: ${err}`);
        });
    }
}

module.exports = NewFamilyCommand;
