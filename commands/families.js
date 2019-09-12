const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const {db} = require('../bot')
const Discord = require('discord.js');


class FamiliesCommand extends Command {
    constructor() {
        super('families', {
            aliases: ['family', 'f'],
            args: [
                {
                    id: 'name',
                    match: 'prefix',
                    prefix: '--name=',
                    default: null
                },
                {
                    id: 'all',
                    match: 'flag',
                    prefix: '--all',
                    default: null
                }],
        });
    }


    exec(message, args) {
        let richEmbed = new Discord.RichEmbed();
        if (args.all) {
            richEmbed.setTitle('Families Created So Far');
        }
        db.find({}).then((docs) => {
            docs.forEach((item, index) => {
                let family = FamilyPlaybook.fromNedbDocument(item);
                async function visitFamily() {
                    await family.visit(richEmbed, args.all );
                }
                visitFamily().then( function() {
                    return message.reply(richEmbed);
                });
            });
        }).catch((err) => {
            return message.reply(`Something terrible happened: ${err}`);
        });
    }
}


module.exports = FamiliesCommand;
