const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const CharacterPlaybook = require('../character_playbook');


class QuickCharacterCommand extends Command {
    constructor() {
        let command_args = [
            {
                id: 'name',
                match: 'prefix',
                prefix: 'n=',
                default: null,
                helptext: 'The name of the character. Must be unique!'
            },
            {
                id: 'family',
                match: 'prefix',
                prefix: 'f=',
                type: 'string',
                optional: false,
                default: null,
                helptext: `The name of the Family to whom the quick character will belong. Run the families command to see what families are currently in play.`
            },
            {
                id: 'force',
                match: 'prefix',
                prefix: 'Force=',
                type: 'int',
                helptext: 'Set your Force',
                optional: false,
                default: null
            },
            {
                id: 'lore',
                match: 'prefix',
                prefix: 'Lore=',
                type: 'int',
                helptext: 'Set your Lore',
                optional: false,
                default: null
            },
            {
                id: 'steel',
                match: 'prefix',
                prefix: 'Steel=',
                type: 'int',
                helptext: 'Set your Steel',
                optional: false,
                default: null
            },
            {
                id: 'sway',
                match: 'prefix',
                prefix: 'Sway=',
                type: 'int',
                helptext: 'Set your Sway',
                optional: false,
                default: null
            },
            {
                id: 'help',
                match: 'flag',
                prefix: '--h',
                default: null,
                helptext: 'Show this message',
                optional: true
            },
        ];
        let aliases = ['quick-character', 'qc'];
        super(CommandsMetadata.getCommands().quick_character.id, {
            aliases: aliases,
            split: 'sticky',
            args: command_args
        });
        this.comments = `This will create a quick character (Legacy CRB pg 68-69). If a quick character already exists with this name, nothing will happen--all character names must be unique! By creating a quick character, that character is not assigned to the Discord user unless the user adds the character using the set-character command. Also unlike the new-character command, the user must specify which Family the character is for; this allows anyone to create quick characters for a Family.  Unlike new-character creation, the user will have to give all the stats on creation (split +1, 0, 0, and -1). Note that \`__Inheritance__\` is not implemented, so you will to remember to add the Family Inheritance bonus yourself!`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} f=Warboys n=Nux Force=1 Lore=0 Steel=1 Sway=-1`,
                commentary: `Creates a Quick Character in the Warboys Family with the name Nux, Force of 1 (Tyrant Kings bonus), Lore of 0, Steel of 1, and Sway of -1.`
            },
            {
                command: `${aliases[1]} -f="The Hive"" -n=Neo -Force=1 -Lore=0 -Steel=-1 -Sway=0`,
                commentary: `Creates a Quick Character in the "The Hive" Family with the name Neo`
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
        if (args.help) {
            return message.reply(this.helpEmbed);
        }
        if (args.name == null || args.family == null) {
            return message.reply(`You need to provide both a Family and name to create a quick character. Please run this command with a --help for the details!`);
        }

        if ( args.force === null  ) {
            return message.reply( `You need a force value with -force, please run this command with a --help for the details`);
        }
        if ( args.steel == null  ) {
            return message.reply( `You need a steel value with -steel, please run this command with a --help for the details`);
        }
        if ( args.lore == null  ) {
            return message.reply( `You need a lore value with -lore, please run this command with a --help for the details`);
        }
        if ( args.sway == null  ) {
            return message.reply( `You need a sway value with -sway, please run this command with a --help for the details`);
        }


        //get the family
        let ownerFamily = await DbUtil.get_family( args.family, guild_id);
        if ( ownerFamily == null ) {
            return message.reply(`The Family ${args.family} does not exist for this guild, please pick a family that does! You can find existing families by running the \`family --all\` command`);
        }

        //check to see if this character name is already in use
        let existingCharacter = await DbUtil.get_character(args.name, guild_id);
        if (existingCharacter) {
            return message.reply(`A character with the name "${existingCharacter.name}" is already in play for this guild, please pick another name!"`);
        }

        //we're good to go. insert the new character
        let retMessage = await DbUtil.insert_character(
            args.name,
            "Quick Character",
            guild_id,
            ownerFamily.name,
            args.force,
            args.lore,
            args.steel,
            args.sway);
        return message.reply(retMessage);
    }

    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = QuickCharacterCommand;
