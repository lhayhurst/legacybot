const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');

class FamiliesCommand extends Command {
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
                helptext: 'The name of the Family to display',
                argtype: "argument",
                type: "string",
                split: "quoted",
                optional: true
            },
            {
                id: 'all',
                match: 'flag',
                prefix: '--all',
                helptext: 'Show all families',
                default: null,
                optional: true
            }];
        let aliases = ['family', 'f']
        super(CommandsMetadata.getCommands().family.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args,
        });
        this.comments = `The family command gives the player information about whatever Family they've chosen, or the families currently associated with their guild`;
        this.command_args = command_args;
        this.examples = [
            {
                command: aliases[1],
                commentary: `Generates just your family handout sheets, if you have set one.`
            },
            {
                command: `${aliases[1]} --all`,
                commentary: `Shows all families associated with this guild.`
            },
            {
                command: `${aliases[1]} "The Warboys"`,
                commentary: `Gets the family sheet for the named family. No quotes needed if a single word name.`
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
            richEmbed.setTitle('Families Created So Far');
        }
        let families = await DbUtil.get_guilds_families(message.guild.id);
        if ( families.length === 0 ) {
            return message.reply( `It seems your guild hasn't created any new families yet! Please run /help and try out the /new-family command first.`);
        }
        for( var i = 0; i < families.length; i++ ) {
            let family = families[i];
            if ( args.all || family.user_id == message.member.user.id || family.name === args.name ) {
                await family.visit(richEmbed, args.all );
            }
        }
        return message.reply(richEmbed);
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}


module.exports = FamiliesCommand;
