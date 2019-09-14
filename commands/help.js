const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const FamilyPlaybook = require('../family_playbook');

class HelpCommand extends Command {
    constructor() {
        super('help command', {
            aliases: ['help', 'h'],
            allowMention: true,
            args: [
                {
                    id: 'playbooks',
                    match: 'flag',
                    prefix: '-p',
                    default: null
                },
            ],
        });
    }

    exec(message, args) {
        if( args.playbooks ) {
            return message.reply(`Here are some playbooks you can use. You can also make up your own! ${JSON.stringify(Object.keys(FamilyPlaybook.playbooks()))}.`)
        }
        let richEmbed = new Discord.RichEmbed();
        richEmbed.attachFiles(['assets/commands.png']).setImage("attachment://commands.png")
        return message.reply(richEmbed);
    }
}

module.exports = HelpCommand;
