const {Command} = require('discord-akairo');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const DbUtil = require('./dbutil');
const Boom = require('./self_destructing_reply');

class DropFamilyCommand extends Command {

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
                default: 7,
                helptext: `Keep parameter for how many seconds you would like to keep this message before it self destructs. \`-k=10\` to keep for 10 seconds, for example. If value is \`-k=forever\`, it will keep forever!`,
                optional: true
            },
        ];
        let aliases = ['drop-family', 'df'];
        super(CommandsMetadata.getCommands().drop_family.id, {
            aliases: aliases ,
            args: command_args
        });
        this.comments = `This command lets you drop a family if you have already set a family.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: aliases[1],
                commentary: `Drops your current family.`
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
        let ownerFamily = await DbUtil.get_users_family(user_id, guild_id);

        if (!ownerFamily) {
            return Boom.self_destruct( message, `You do not have a family to drop!`);
        }
        else {
            await DbUtil.update_family(ownerFamily, { managed_by_username : null, managed_by_user_id: null } );
            return Boom.self_destruct( message, `dropped your family, please run the \`.sf\` command to take a new family`);
        }

    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}

module.exports = DropFamilyCommand;
