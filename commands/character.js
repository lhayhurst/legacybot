const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const CharacterPlaybookView = require('../view/character_playbook_view');
const PropertyMagic = require('./property_magic');

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
                helptext: 'Show all Characters ',
                default: null,
                optional: true
            },
            {
                id: 'text_output_mode',
                match: 'flag',
                prefix: '--text',
                helptext: 'Output character sheet as simple text',
                default: false,
                optional: true
            },
            {
                id: 'show_props',
                match: 'flag',
                prefix: '--p',
                helptext: 'Show all properties that can be get, set, added, or del for a character',
                default: false,
                optional: true
            },
            {
                id: 'property_action',
                type: "string",
                default: null,
                optional: false,
                argtype: "argument",
                helptext: `Valid actions are ${JSON.stringify(PropertyMagic.PropertyActions())};`
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
        let aliases = ['character', '.char', 'c']
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
                command: `${aliases[1]} set notes "Nux was originally a follower of Immortan Joe and was willing to die for his cause, attempting to impress him on several occasions. ... Nux was found on the war-rig by one of Immortan Joe's wives and was taken in, eventually becoming a vital member of Furiosa's team."`,
                commentary: `Let's you set the character notes for this character.`
            },
            {
                command: `${aliases[1]} add notes "..., and then they go, WITNESS MEEE!!"`,
                commentary: `Let's you add to the character notes for this Family.`
            },
            {
                command: `${aliases[1]} --p`,
                commentary: `show all the properties that can be get or set.`
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

        let guild_id = message.guild.id;
        let user_id = message.member.user.id;
        let re = new Discord.RichEmbed();
        let cview = new CharacterPlaybookView( re );
        let console_results = null;

        if( args.show_props) {
            console_results = `Here are the string properties of a character. You can get, set, add, or remove them:  ${JSON.stringify(PropertyMagic.CharacterStringProperties())}\n`;
            console_results += `Here are the string array properties of a character you can get, add, or remove: ${JSON.stringify(PropertyMagic.CharacterArrayofStringProperties())}`;
        }
        else if ( args.property_name && args.property_action  ) {
            let character = await DbUtil.get_users_character(user_id, guild_id);
            if (character == null ) {
                return message.reply(`Before setting your character notes, you need to run the \`set-family\` command`);
            }
            console_results = await this.propertyCrud( args, character );
        }
        else if(args.all) {
            console_results = await this.handleAll(guild_id, cview);
        }

        else {
            let character = null;
            if (args.name) {
                character = await DbUtil.get_character_by_name(args.name, guild_id);
            }
            else {
                character = await DbUtil.get_users_character(user_id, guild_id);
            }
            if (character == null) {
                return `Before running an action command, you need to run the \`set-character\` command`;
            }
            console_results = await cview.visitCharacter(character, args.text_output_mode);
        }
        if( console_results ) {
            return message.reply(console_results);
        }
        else {
            return message.reply(cview.richEmbed);
        }
    }

    async propertyCrud(args, character) {
        let pm = new PropertyMagic( PropertyMagic.CharacterStringProperties(),
            PropertyMagic.CharacterArrayofStringProperties() );
        let ret = await pm.process( args, character);
        if( character.isModified()) {
            await character.save();
        }
        return ret;
    }

    async handleAll( guild_id, view ) {
        let characters = await DbUtil.get_guilds_characters(guild_id);
        if ( characters.length === 0 ) {
            return `It seems your guild hasn't created any new characters yet! Please run .help and try out the .new-characters command first.`;
        }
        await view.visitAll(characters);
        return null;
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}


module.exports = CharacterCommand;
