const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const {db} = require('../bot')
const Discord = require('discord.js');


class FamiliesCommand extends Command {
    constructor() {
        super('families', {
            aliases: ['family', 'f'],
            split: 'quoted',
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
        db.find({guild_id: message.guild.id }).then((docs) => {
            if( docs.length == 0 ) {
                return message.reply( `It seems your guild hasn't created any new families yet! Please run /help and try out the /new-family command first.`);
            }
            docs.forEach((item, index) => {
                let family = FamilyPlaybook.fromNedbDocument(item);
                console.log(family);
                async function visitFamily() {
                    if (args.name == null || args.name === family.name ) {
                        await family.visit(richEmbed, args.all);
                    }
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
