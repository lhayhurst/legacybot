const {Command} = require('discord-akairo');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const DbUtil = require('./dbutil');
const Boom = require('./self_destructing_reply');
class SetCharacterCommand extends Command {
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
                command: `${aliases[1]} -help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    async aexec(message, args) {
        Boom.keep(args.keep);
        if (args.help) {
            return Boom.self_destruct( message, new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }
        //search for this character
        let guild_id = message.guild.id;
        let user_id = message.member.user.id;

        if ( args.name === null ) {
            return Boom.self_destruct( message, "Please provide a character name to this command (-help to see some examples");
        }

        let character = await DbUtil.get_character_by_name( args.name, guild_id );
        if ( character == null ) {
            return Boom.self_destruct( message, `A character with name ${args.name} could not be found`);
        }

        if( character.user_id == user_id ) {
            return Boom.self_destruct( message, "You are already playing this character!");
        }
        if ( character.user_id) {
            //someone else already has this one
            return Boom.self_destruct( message, `${character.managed_by_username} is already playing this character! Ask them to `.dc` for you.`);
        }

        let family = await DbUtil.get_users_family(user_id, guild_id);
        if (family == null ) {
            return Boom.self_destruct( message, `You need to \`.sf\` before you can add a character`);
        }

        //ok, we're good to go

        await DbUtil.update_character(
            character,
            {
                "managed_by_username": message.member.user.username,
                "managed_by_user_id" : user_id,
                 },
            );

        return Boom.self_destruct( message,  `You are now managing ${character.name}, ${character.playbook} of ${family.name}`);
    }

    exec(message, args) {
        return this.aexec(message,args);
    }
}

module.exports = SetCharacterCommand;
