const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');

class CharacterCommand extends Command {
    constructor() {
        let command_args = [
            {
                id: 'help',
                match: 'flag',
                prefix: '--h',
                default: null,
                helptext: 'Show this message',
                optional: true
            },
            {
                id: 'name',
                default: null,
                helptext: 'The name of the Character to display',
                argtype: "argument",
                type: "string",
                split: "quoted",
                optional: true
            },
            {
                id: 'all',
                match: 'flag',
                prefix: '--all',
                helptext: 'Show all Characters ',
                default: null,
                optional: true
            }];
        let aliases = ['character', 'c']
        super(CommandsMetadata.getCommands().character.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args,
        });
        this.comments = `The character command gives the player information about whatever Character they've chosen, or the Characters currently associated with their guild`;
        this.command_args = command_args;
        this.examples = [
            {
                command: aliases[1],
                commentary: `Generates just your character handout sheets, if you have set one.`
            },
            {
                command: `${aliases[1]} --all`,
                commentary: `Shows all characters associated with this guild.`
            },
            {
                command: `${aliases[1]} Max`,
                commentary: `Gets the character sheet for the named character. No quotes needed if a single word name.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async aexec(message, args) {
        if ( args.help ) {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }
        let richEmbed = new Discord.RichEmbed();

        if (args.all) {
            richEmbed.setTitle('Characters Created So Far');
        }
        let characters = await DbUtil.get_guilds_characters(message.guild.id);
        if ( characters.length === 0 ) {
            return message.reply( `It seems your guild hasn't created any new characters yet! Please run .help and try out the .new-characters command first.`);
        }
        for( var i = 0; i < characters.length; i++ ) {
            let character = characters[i];
            if ( args.all || character.user_id === message.member.user.id || character.name === args.name ) {
                await character.visit(richEmbed, args.all );
            }
        }
        return message.reply(richEmbed);
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}


module.exports = CharacterCommand;
