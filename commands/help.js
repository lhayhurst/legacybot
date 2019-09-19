const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const FamilyPlaybook = require('../family_playbook');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const config = require('config');
const Boom = require('./self_destructing_reply');

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
                id: 'keep',
                match: 'prefix',
                prefix: '-k=',
                default: 7,
                helptext: `Keep parameter for how many seconds you would like to keep this message before it self destructs. \`-k=10\` to keep for 10 seconds, for example. If value is \`-k=forever\`, it will keep forever!`,
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
        this.prefix = config.get("LegacyBotCommandPrefix");
        this.comments = `While exploring the Ruins, you come across a ancient Robot running some variant of UNIX! You can learn more about the commands it supports by typing in \`${this.prefix}${this.aliases[0]} -c\`. You can learn more about this bot by heading to the [project home page](https://github.com/lhayhurst/legacybot/blob/master/README.md).`;
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
        Boom.keep(args.keep);
        if( args.playbooks ) {
            return Boom.self_destruct( message, `Here are some playbooks you can use. You can also make up your own! ${JSON.stringify(Object.keys(FamilyPlaybook.playbooks()))}.`)
        }
        if( args.commands ) {
            let registeredCommands = CommandsMetadata.getCommands();
            let rcKeys = Object.keys( registeredCommands);
            let embed = new Discord.RichEmbed();
            embed.setTitle("Legacybot Commands");
            embed.setDescription(`Here are the commands that Legacybot supports. Type in the command name followed by -help to learn more about it.`);
            for( var i =0; i < rcKeys.length; i++ ) {
                let rc = registeredCommands[rcKeys[i]];
                embed.addField( `\`${this.prefix}${rc.id}\``, rc.note, false );
            }
            return Boom.self_destruct( message, embed);
        }
        else {
            return Boom.self_destruct( message,  new HelpEmbed(
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
