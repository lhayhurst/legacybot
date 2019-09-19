const {Command} = require('discord-akairo');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const DbUtil = require('./dbutil');

class DropFamilyCommand extends Command {

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
                id: 'action',
                type: 'string',
                optional: false,
                argtype: "argument",
                default: null,
                helptext: `The level you want to zoom to. put in \`in\` to zoom in, and \`out\` to zoom out. To reset your nickname to your username, use \`away\`.`
            }
        ];
        let aliases = ['zoom', 'z'];
        super(CommandsMetadata.getCommands().zoom.id, {
            aliases: aliases ,
            args: command_args
        });
        this.comments = `This command lets zoom in and out between character and family mode..`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} in`,
                commentary: `Zooms into your character.`
            },
            {
                command: `${aliases[1]} out`,
                commentary: `Zooms out from character.`
            },
            {
                command: `${aliases[1]} away`,
                commentary: `Zooms away from your character or family -- your nickname is reset to your username.`
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

        if( ! (args.action === 'in' || args.action === 'out' || args.action === 'away' ) ) {
            return message.reply( `Invalid zoom action ${args.action}, please use either  \`in\` or \`out\``)
        }

        if ( args.action === 'away' ) {
            await message.member.setNickname(message.member.user.username)
                .catch(console.error);
            return message.reply(`zoomed away`);
        }

        if ( args.action === "in") {
            //zoom into character
            //try change their nickname


            let character = await DbUtil.get_users_character(user_id, guild_id);
            if (!character) {
                return message.reply(`You must have a character in order to zoom, please run the \`.sf\` command!`);
            }

            await message.member.setNickname(character.name, "User set their character")
                .catch(console.error);
            return message.reply(`zoomed in`);
        }
        else {
            let family = await DbUtil.get_users_family(user_id, guild_id);
            if (!family) {
                return message.reply(`You must have a family in order to zoom, please run the \`.sf\` command!`);
            }
            await message.member.setNickname(family.name, "User set their character")
                .catch(console.error);
            return message.reply(`zoomed out`);
        }

    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}

module.exports = DropFamilyCommand;
