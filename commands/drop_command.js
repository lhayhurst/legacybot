const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');

let drop_command_args = [
    {
        id: 'help',
        match: 'flag',
        prefix: '--h',
        default: null,
        helptext: 'Show this message',
        optional: true
    },
];

class DropFamilyCommand extends Command {

    constructor() {
        super('drop family command', {
            aliases: ['drop-family', 'df'],
            args: drop_command_args
        });
    }

    async aexec(message, args) {

        if ( args.help ) {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.aliases,  //its aliases
                //this.options
                "Disassociates a user with the named family. This won't delete the family." ).embed );
        }
        let guild_id = message.guild.id;
        let user_id = message.member.user.id;
        let ownerFamily = await DbUtil.get_users_family(user_id, guild_id);

        if (!ownerFamily) {
            return message.reply(`You do not have a family to drop!`);
        }
        else {
            await DbUtil.update_family_multiple_values(ownerFamily, { user_id : null, username: null } );
            return message.reply(`dropped your family, please run the /nf command to take a new family`);
        }

    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}

module.exports = DropFamilyCommand;
