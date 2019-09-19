const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('../view/help_embed');
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
                id: 'property_action',
                type: "string",
                default: null,
                optional: false,
                argtype: "argument",
                helptext: `whatever action value you are setting`
            },
            {
                id: 'property_name', //from CPlaybook
                type: "string",
                helptext: `\`property\` is prop you are interested in, run \`.c --properties\``,
                argtype: "command",
                optional: true,
                default: null
            },

            {
                id: 'property_value',
                type: "string",
                default: null,
                optional: false,
                argtype: "argument",
                helptext: `whatever action value you are setting`
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
                command: `${aliases[1]} notes "War Boys are the paramilitary arm of The Citadel and serve as Immortan Joe's servants and soldiers. War Boys are hand picked at a young age by the guardians of the elevator platform of The Citadel and are indoctrinated as zealots in the cult of V8 with Immortan Joe as their immortal leader."`,
                commentary: `Let's you set the character notes for this Family.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async propertyCrud(args, family) {
        let name = args.property_name;
        let action = args.property_action;
        let value = args.property_value;

        let dirty = false;
        let actionMap = {
            'notes' : {
                'set' : async function( family, notes ) {family.notes = notes; dirty=true; return `set!`; },
                'get' : async function( family) { return `notes is: ${family.notes}` },
                'add' : async function( family, notes) { family.notes += notes ; dirty=true; return `added!`; }
            },
            'doctrine' : {
                'set' : async function( family, doctrine ) {family.doctrine = doctrine; dirty=true; return `set!`; },
                'get' : async function( family ) { return `doctrine is ${family.doctrine}` }
            },
            'lifestyle' : {
                'set' : async function( family, lifestyle ) {family.lifestyle = lifestyle; dirty=true; return `set!`; },
                'get' : async function( family ) {  return `lifestyle is ${family.lifestyle}`; }
            }
        };
        try {
            let func = actionMap[name][action];
            if ( func ) {
                let ret = await func(family, value);
                if (dirty) {
                    await family.save();
                }
                if ( ret == null ) {
                    ret = `Family property ${name} has no value yet`;
                }
                return ret;
            }
            return `Sorry, didn't know what to do with that!`;
        }
        catch( e ) {
            console.log(e);
        }
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
        let console_results = null;
        let fview = new FamilyPlaybookView( richEmbed );

        if ( args.property_name && args.property_action  ) {
            let family = await DbUtil.get_users_family(user_id, guild_id);
            if (family == null ) {
                return message.reply(`Before setting your Family notes, you need to run the \`set-family\` command`);
            }
            console_results = await this.propertyCrud( args, family );
        }
        else if (args.all) {
            console_results = await this.handleAll(guild_id, fview);
        }
        else {
            let family = null;
            if (args.name) {
                family = await DbUtil.get_family(args.name, guild_id);
            }
            else {
                family = await DbUtil.get_users_family(user_id, guild_id);
            }
            if (family == null) {
                console_results =  `Before running an action command, you need to run the \`set-family\` command`;
            }
            else {
                console_results = await fview.visitFamily(family, args.text_output_mode);
            }
        }

        if( console_results ) {
            return message.reply(console_results);
        }
        else {
            return message.reply(fview.richEmbed);
        }

    }

    async handleAll( guild_id, view ) {
        let families = await DbUtil.get_guilds_families(guild_id);
        if ( families.length === 0 ) {
            `It seems your guild hasn't created any new families yet! Please run /help and try out the /new-family command first.`;
        }
        await view.visitAll(families);
        return null;
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}


module.exports = FamiliesCommand;
