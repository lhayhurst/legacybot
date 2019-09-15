const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const CharacterPlaybook = require('../character_playbook');



class NewCharacterCommand extends Command {
    constructor() {
        let command_args =  [
            {
                id: 'help',
                match: 'flag',
                prefix: '--h',
                default: null,
                helptext: 'Show this message',
                optional: true
            },
            {
                id: 'playbook',
                match: 'prefix',
                prefix: 'p=',
                helptext: 'The playbook to use for the character',
                default: null
            },
            {
                id: 'name',
                match: 'prefix',
                prefix: 'n=',
                default: null,
                helptext: 'The name of the character. Must be unique!'
            }
        ];
        let aliases =  ['new-character', 'nc'];
        super(CommandsMetadata.getCommands().new_character.id, {
            aliases: aliases,
            split: 'sticky',
            args: command_args
        });
        this.comments = `This will create a new character. If a character already exists with this name, nothing will happen--all character names must be unique! By creating a new character, that character is not assigned to the Discord user unless the user adds the character using the set-character command. The character is, however, will be associated with the Family that the user has chosen. The playbook may be one of the core Legacy character classes (CRB page 164). Note, Legacybot will match your playbook string against existing playbooks; for example, setting your playbook to "elder" or "Elder" will result you creating a character from "The Elder" playbook`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} -p="Survivor" -n=Max` ,
                commentary: `Creates a new Character from "The Survivor" playbook with the name "Max"`
            },
            {
                command: `${aliases[1]} -p="Survivor" -n="Max Rockantansky` ,
                commentary: `Creates a new Character from "The Survivor" playbook with the name "Max Rockantansky"`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    get helpEmbed() {
        return new HelpEmbed(
            this.id, //the name of the command
            this.command_args,
            this.aliases,  //its aliases
            this.comments,
            this.examples).embed;
    }

    async doexec(message, args) {
        let guild_id = message.guild.id;
        if ( args.help ) {
            return message.reply( this.helpEmbed );
        }
        if (args.name == null || args.playbook == null ) {
            return message.reply(`You need to provide both a playbook and name to create a new character. Please run this command with a --help for the details!`);
        }

        //check to see if this family name is already in use
        let existingCharacter = await DbUtil.get_character(args.name, guild_id);
        if ( existingCharacter ) {
            return message.reply(`A character with the name "${existingCharacter.name}" is already in play for this guild, please pick another name!"`);
        }

        //check to see if this playbook matches a stock playbook
        let stock_playbook = CharacterPlaybook.find_stock_playbook( args.playbook );
        if ( stock_playbook ) {
            args.playbook = stock_playbook;
        }

        //check to see if this playbook name is already in use
        let existingPlaybook = await DbUtil.get_character_by_playbook(args.playbook, guild_id);
        if ( existingPlaybook ) {
            return message.reply(`A character with the playbook "${args.playbook}" is already in play for this guild, please pick another playbook!`);
        }

        //check to see if this user already has a character
        let user_id = message.member.user.id;
        let ownerCharacter = await DbUtil.get_users_character(user_id, guild_id);
        if (ownerCharacter !== null) {
            return message.reply(`You have already set your character to the character with the name "${ownerCharacter.name}". Please drop that character before creating a new one!`);
        }

        //check to see if this user already has a family
        let ownerFamily = await DbUtil.get_users_family(user_id, guild_id);
        if (ownerFamily === null) {
            return message.reply(`In order to create a character, you must first set your family using the \`set-family\` command.`);
        }

        //we're good to go. insert the new character
        let retMessage = await DbUtil.insert_character( args.name, args.playbook, guild_id, ownerFamily.name);
        return message.reply(retMessage);
    }
    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = NewCharacterCommand;
