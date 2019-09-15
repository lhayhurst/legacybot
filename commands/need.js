const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');

class NeedCommand extends Command {
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
                id: 'action', //add or remove
                type: "string",
                default: null,
                helptext: `can be \`add\` or \`remove\` to add or remove need, respectively.`,
                optional: false,
                argtype: "command"
            },
            {
                id: 'resource',
                type: "string",
                default: null,
                optional: false,
                argtype: "argument",
                helptext: `The name of the resource you are adding. If more than one word, quote it -- for ex, "Barter Goods".`
            }
        ];
        let aliases = ['need', 'n'];
        super(CommandsMetadata.getCommands().need.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args,
        });
        this.comments = `The need command lets you add or remove Needs (Core Rulebook, Second Edition page 31). It will accept any resource name as an argument.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} add "Barter Goods"`,
                commentary: `Adds the resource "Barter Goods" to your Family Needs.`
            },
            {
                command: `${aliases[1]} remove "Barter Goods"`,
                commentary: `Removes the resource "Barter Goods" to your Family Needs.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async doexec(message, args) {
        let guild_id = message.guild.id;
        let action = args.action;
        let resource = args.resource;

        if ( args.help ) {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        //sanity checks
        if (resource === null || action === null) {
            return message.reply(`You need to provide an action and a resource; please run this command with --help to learn about it.`);
        }

        if (!(action === "add" || action === "remove")) {
            return message.reply(`Unknown action ${action}, valid actions are "add" or "remove. Please run this command with --help to learn about it.`);
        }

        let ownerFamily = await DbUtil.get_users_family(message.member.user.id, guild_id);
        if (ownerFamily == null) {
            return message.reply(`You have not set your family set; please run the set-family command before running this command!`);
        }

        //ready to rock
        if (action === "add") {
            ownerFamily.addNeed(resource);
        } else {
            ownerFamily.removeNeed(resource)
        }
        await DbUtil.update_family(ownerFamily, 'needs', ownerFamily.needs);
        return message.reply(`Family ${ownerFamily.name} now has Needs: ${JSON.stringify(ownerFamily.needs)}`)
    }

    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = NeedCommand;
