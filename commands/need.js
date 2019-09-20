const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const Boom = require('./self_destructing_reply');

class NeedCommand extends Command {
    constructor() {
        let command_args =  [
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
                helptext: `The name of the resource you are adding. If more than one word, quote it - for ex, "Barter Goods".`
            }
        ];
        let aliases = ['need', 'n'];
        super(CommandsMetadata.getCommands().need.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args,
        });
        this.comments = `The ${aliases[0]} command lets you add or remove Needs (Core Rulebook, Second Edition page 31). It will accept any resource name as an argument.`;
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
                command: `${aliases[1]} -help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async aexec(message, args) {
        Boom.keep(args.keep);
        let guild_id = message.guild.id;
        let action = args.action;
        let resource = args.resource;

        if ( args.help ) {
            return Boom.self_destruct( message,  new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        //sanity checks
        if (resource === null || action === null) {
            return Boom.self_destruct( message, `You need to provide an action and a resource; please run this command with -help to learn about it.`);
        }

        if (!(action === "add" || action === "remove")) {
            return Boom.self_destruct( message, `Unknown action ${action}, valid actions are "add" or "remove. Please run this command with -help to learn about it.`);
        }

        let ownerFamily = await DbUtil.get_users_family(message.member.user.id, guild_id);
        if (ownerFamily == null) {
            return Boom.self_destruct( message, `You have not set your family set; please run the set-family command before running this command!`);
        }

        //ready to rock
        if (action === "add") {
            if (ownerFamily.needs.indexOf(resource) === -1) {
                ownerFamily.needs.push(resource);
            }
        } else {
            let index = ownerFamily.needs.indexOf(resource);
            if (index > -1) {
                ownerFamily.needs.splice(index, 1);
            }
        }
        await DbUtil.update_family(ownerFamily, { 'needs': ownerFamily.needs } );
        return Boom.self_destruct( message, `Family ${ownerFamily.name} now has Needs: ${JSON.stringify(ownerFamily.needs)}`)
    }

    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = NeedCommand;
