const {Command} = require('discord-akairo');
const Discord = require('discord.js');

class HelpCommand extends Command {
    constructor() {
        super('help command', {
            aliases: ['help', 'h'],
            allowMention: true
        });
    }

    exec(message, args) {
        let richEmbed = new Discord.RichEmbed();
        richEmbed.attachFiles(['assets/commands.png']).setImage("attachment://commands.png")
        return message.reply(richEmbed);
    }
}

module.exports = HelpCommand;
