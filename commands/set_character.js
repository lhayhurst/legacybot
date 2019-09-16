const {Command} = require('discord-akairo');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const DbUtil = require('./dbutil');

class SetCharacterCommand extends Command {
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
                split: 'quoted',
                type: 'string',
                optional: false,
                default: null,
                argtype: "argument",
                helptext: `The name of the Character you are playing. Run the \`character\` command to see what characters are currently in play.`
            }
        ];
        let aliases = ['set-character', 'sc']
        super(CommandsMetadata.getCommands().set_character.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args
        });
        this.comments = `The ${aliases[0]} command is needed for if you want to run any Character specific related commands. Also, when you roll dice, if you've set your character, you can add stat modifiers to the dice rolls.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} Neo`,
                commentary: `Sets Neo as your character.`
            },
            {
                command: `${aliases[1]} "Mad Max"`,
                commentary: `Sets "Mad Max"" as your character.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async aexec(message, args) {
        if (args.help) {
            return message.reply(new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }
        //search for this character
        if ( args.name === null ) {
            return message.reply("Please provide a character name to this command (--help to see some examples");
        }

        let guild_id = message.guild.id;
        let character = await DbUtil.get_character_by_name( args.name, guild_id );
        if ( character == null ) {
            return message.reply(`A character with name ${args.name} could not be found`);
        }

        if( character.user_id == message.member.user.id ) {
            return message.reply("You are already playing this character!");
        }
        if ( character.user_id) {
            //someone else already has this one
            return message.reply(`Player ${character.user_id} is already playing this character.`);
        }

        //ok, we're good to go
        await DbUtil.update_character_multiple_values(
            character,
            {
                "character_username": message.member.user.username,
                "character_user_id" : message.member.user.id } );

        return message.reply( `You have set your character to \`${args.name}\``);
    }

    exec(message, args) {
        return this.aexec(message,args);
    }
}

module.exports = SetCharacterCommand;
