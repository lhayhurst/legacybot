const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const FamilyPlaybook = require('../family_playbook');

class NewFamilyCommand extends Command {
    constructor() {
        super('new family command', {
            aliases: ['new-family', 'nf'],
            split: 'sticky',
            args: [
                {
                    id: 'playbook',
                    match: 'prefix',
                    prefix: 'p=',
                    default: null
                },
                {
                    id: 'name',
                    match: 'prefix',
                    prefix: 'n=',
                    default: null
                }
            ]
        });
    }

    static reply(args) {
        return new NewFamilyCommandReply(args).reply;
    }

    async doexec(message, args) {
        let guild_id = message.guild.id;
        if (args.name == null || args.playbook == null ) {
            return message.reply(`Usage: /nf -p="playbook name" -n="family name"`);
        }

        //check to see if this family name is already in use
        let existingFamily = await DbUtil.get_family(args.name, guild_id);
        if ( existingFamily ) {
            return message.reply(`A family with the name "${existingFamily.name}" is already in play for this guild, please pick another name!"`);
        }

        //check to see if this playbook matches a stock playbook
        let stock_playbook = FamilyPlaybook.find_stock_playbook( args.playbook );
        if ( stock_playbook ) {
            args.playbook = stock_playbook;
        }

        //check to see if this playbook name is already in use
        let existingPlaybook = await DbUtil.get_family_by_playbook(args.playbook, guild_id);
        if ( existingPlaybook ) {
            return message.reply(`A family with the playbook "${args.playbook}" is already in play for this guild, please pick another playbook!"`);
        }

        //check to see if this user already has a family
        let user_id = message.member.user.id;
        let ownerFamily = await DbUtil.get_users_family(user_id, guild_id);
        if (ownerFamily !== null) {
            return message.reply(`You have already set your family to the family with the name "${ownerFamily.name}". Please drop that family before taking on a new one!`);
        }

        //we're good to go. insert the new family
        let retMessage = await DbUtil.insert_family( user_id, guild_id, args.playbook, args.name );
        return message.reply(retMessage);
    }
    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = NewFamilyCommand;
