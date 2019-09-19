const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const Boom = require('./self_destructing_reply');
class SetFamilyCommand extends Command {
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
                argtype: "argument",
                default: null,
                helptext: `The name of the Family you are adopting. Run the families command to see what families are currently in play.`
            }
        ];
        let aliases =  ['set-family', 'sf']
        super(CommandsMetadata.getCommands().set_family.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args
        });
        this.comments = `The ${aliases[0]} command is needed for if you want to run any Family specific related commands like need, surplus, treaty. Also, when you roll dice, if you've set your family, you can add stat modifiers to the dice rolls.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} Warboys`,
                commentary: `Sets the Warboys as your Family.`
            },
            {
                command: `${aliases[1]} "Durnk Bots"`,
                commentary: `Sets the Durnk Bots as your Family.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async aexec(message, args) {
        if ( args.help ) {
            return Boom.self_destruct( message,  new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        if (args.name == null ) {
            return Boom.self_destruct( message, `Please give this command a n="family name" option`);
        }

        let guild_id = message.guild.id;
        let user_id = message.member.user.id;
        let username = message.member.user.username;
        //look for the family with that name
        let family = await DbUtil.get_family( args.name, guild_id );

        if ( family == null ) {
            return Boom.self_destruct( message, `No family found with name ${args.name}!`);
        }
        if ( family.managed_by_user_id && family.managed_by_user_id === user_id) {
            return Boom.self_destruct( message, `You are already set to the family with name '${vivifiedFamily.name}'`);
        }
        else {
            if ( family.managed_by_user_id ) {
                return Boom.self_destruct( message, `That family is already set to a different user: ${family.managed_by_username}`);
            }
        }

        //ok, we're good to go
        await DbUtil.update_family(family, {managed_by_username: username, managed_by_user_id: user_id});
        return Boom.self_destruct( message, `you have set your family to ${family.playbook} with name '${family.name}'`);

    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}

module.exports = SetFamilyCommand;
