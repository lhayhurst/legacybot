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
        else {
            return message.reply( `Welcome to LegacyBot! You can learn more about this bot, and the commands it supports, by heading over to https://github.com/lhayhurst/legacybot/`)
        }
    }
}

module.exports = HelpCommand;
