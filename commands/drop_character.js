const {Command} = require('discord-akairo');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const DbUtil = require('./dbutil');

class DropCharacterCommand extends Command {

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
        ];
        let aliases = ['drop-character', 'dc'];
        super(CommandsMetadata.getCommands().drop_character.id, {
            aliases: aliases ,
            args: command_args
        });
        this.comments = `This command lets you character a family if you have already set a family.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: aliases[1],
                commentary: `Drops your current character.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ];
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
        let ownerCharacter = await DbUtil.get_users_character(user_id, guild_id);

        if (!ownerCharacter) {
            return message.reply(`You do not have a character to drop!`);
        }
        else {
            await DbUtil.update_character_multiple_values(ownerCharacter, { character_user_id : null, character_username: null } );
            return message.reply(`dropped your character, please run the \`sc\` command to take a new character`);
        }

    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}

module.exports = DropCharacterCommand;
