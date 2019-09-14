const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');

let args = [
    {
        id: 'help',
        match: 'flag',
        prefix: '--h',
        default: null,
        helptext: 'Show this message'
    },
];

class DropFamilyCommand extends Command {

    constructor() {
        super('drop family command', {
            aliases: ['drop-family', 'df'],
            args: args
        });
    }

    async doexec(message, args) {

        if ( args.help ) {
            return message.reply( new HelpEmbed(this.id, this.aliases, "Disassociates a user with the named family. This won't delete the family." ).embed );
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
        return this.doexec(message, args);
    }
}

module.exports = DropFamilyCommand;
