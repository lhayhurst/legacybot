const {Command} = require('discord-akairo');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const DbUtil = require('./dbutil');
const Boom = require('./self_destructing_reply');

class DropCharacterCommand extends Command {

    constructor() {
        let command_args = [
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
                default: 30,
                helptext: `Keep parameter for how many seconds you would like to keep this message before it self destructs. \`-k=10\` to keep for 10 seconds, for example. If value is \`-k=forever\`, it will keep forever!`,
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
                command: `${aliases[1]} -help`,
                commentary: `Gets help on this command.`
            }
        ];
    }

    async aexec(message, args) {
        Boom.keep(args.keep);

        if ( args.help ) {
            return Boom.self_destruct( message,  new HelpEmbed(
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
            return Boom.self_destruct( message, `You do not have a character to drop!`);
        }
        else {
            await DbUtil.update_character(ownerCharacter, { managed_by_username : null, managed_by_user_id: null, family: null } );
            return Boom.self_destruct( message, `dropped your character, please run the \`sc\` command to take a new character`);
        }

    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}

module.exports = DropCharacterCommand;
