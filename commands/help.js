const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const FamilyPlaybook = require('../family_playbook');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const config = require('config');

class HelpCommand extends Command {
    constructor() {
        let command_args =  [
            {
                id: 'help',
                match: 'flag',
                prefix: '-h',
                default: null,
                helptext: 'Show this message',
                optional: true
            },
            {
                id: 'playbooks',
                match: 'flag',
                prefix: '-p',
                default: null,
                helptext: 'Show the family playbooks',
                optional: true,
            },
            {
                id: 'commands',
                match: 'flag',
                prefix: '-c',
                default: null,
                helptext: 'Show list all the commands I support',
                optional: true,
            },
        ];
        super(CommandsMetadata.getCommands().help.id, {
            aliases: ['help','h'],
            allowMention: true,
            args: command_args
        });
        this.comments = `Welcome to LegacyBot! You can learn more about this bot, and the commands it supports, by heading over to [https://github.com/lhayhurst/legacybot/blob/master/README.md](here)`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `h -p`,
                commentary: `List all the playbooks Legacybot knows`
            },
            {
                command: `h -c`,
                commentary: `List all the commands Legacybot supports`
            }
        ]
    }

    async aexec(message, args) {
        if( args.playbooks ) {
            return message.reply(`Here are some playbooks you can use. You can also make up your own! ${JSON.stringify(Object.keys(FamilyPlaybook.playbooks()))}.`)
        }
        if( args.commands ) {
            let registeredCommands = CommandsMetadata.getCommands();
            let rcKeys = Object.keys( registeredCommands);
            let embed = new Discord.RichEmbed();
            embed.setTitle("Legacybot Commands");
            embed.setDescription(`Here are the commands that Legacybot supports. Type in the command name followed by --help to learn more about it.`);
            for( var i =0; i < rcKeys.length; i++ ) {
                let rc = registeredCommands[rcKeys[i]];
                embed.addField( `\`${config.get("LegacyBotCommandPrefix")}${rc.id}\``, rc.note, true );
            }
            return message.reply(embed);
        }
        else {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}

module.exports = HelpCommand;
