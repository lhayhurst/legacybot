const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');

class NeedCommand extends Command {
    constructor() {
        super('need_command', {
            aliases: ['need', 'n'],
            split: 'quoted',
            args: [
                {
                    id: 'action', //add or remove
                    type: "string",
                    default: null
                },
                {
                    id: 'resource',
                    type: "string",
                    default: null
                }
            ]
        });
    }

    async doexec(message, args) {
        let guild_id = message.guild.id;
        let action = args.action;
        let resource = args.resource;

        //sanity checks
        if (resource === null || action === null) {
            return message.reply(`You need to provide an action and a resource; please run /help`);
        }

        if (!(action === "add" || action === "remove")) {
            return message.reply(`Unknown action ${action}, valid actions are "add" or "remove`);
        }

        let ownerFamily = await DbUtil.get_users_family(message.member.user.id, guild_id);
        if (ownerFamily == null) {
            return message.reply(`You have not set your family set -- please run "/set-family 'family name'" before running the treaty command!`);
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
