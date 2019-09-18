const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const FamilyPlaybookView = require('../view/family_playbook_view');

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
                match: 'prefix',
                prefix: 'n=',
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
            },
            {
                id: 'action', //notes
                type: "string",
                helptext: '\`notes\` the only action you can type in here',
                argtype: "command",
                optional: true,
                default: null
            },
            {
                id: 'notes',
                type: "string",
                default: null,
                optional: false,
                argtype: "argument",
                helptext: `Your notes for this Family`
            }
            ];
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
                command: `${aliases[1]} note "War Boys are the paramilitary arm of The Citadel and serve as Immortan Joe's servants and soldiers. War Boys are hand picked at a young age by the guardians of the elevator platform of The Citadel and are indoctrinated as zealots in the cult of V8 with Immortan Joe as their immortal leader."`,
                commentary: `Let's you set the character notes for this Family.`
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
        let guild_id = message.guild.id;
        let user_id = message.member.user.id;

        if ( args.action && args.action === 'notes') {
            let family = await DbUtil.get_users_family(user_id, guild_id);
            if (family == null ) {
                return message.reply(`Before setting your Family notes, you need to run the \`set-family\` command`);
            }
            await DbUtil.update_family(family, "notes", args.notes);
            return message.reply( `You have set your Family notes`);
        }


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
                let fpv = new FamilyPlaybookView( family );
                await fpv.visit(richEmbed, args.all );
            }
        }
        return message.reply(richEmbed);
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}


module.exports = FamiliesCommand;
