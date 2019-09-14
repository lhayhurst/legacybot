const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');

class TreatyCommand extends Command {
    constructor() {
        super('treaty command', {
            aliases: ['treaty', 't'],
            split: 'quoted',
            args: [
                {
                    id: 'action',
                    type: "string",
                    default: null
                },
                {
                    id: 'family',
                    type: "string",
                    default: null
                },
                {
                    id: 'bonus',
                    match: 'prefix',
                    prefix: '+',
                    type: "int",
                    default: null
                },

            ]
        });
    }




    async doexec(message, args) {
        let guild_id = message.guild.id;
        let family_name = args.family;
        let action = args.action;

        let ownerFamily = await DbUtil.get_users_family(message.member.user.id, guild_id);
        if (ownerFamily == null) {
            return message.reply(`You have not set your family set -- please run "/set-family 'family name'" before running the treaty command!`);
        }

        if (family_name == null && action == null) {
            let richEmbed = new Discord.RichEmbed();
            ownerFamily.visitTreaties(richEmbed)
            return message.reply(richEmbed);
        }
        if (!(action === 'give' || action === 'get' || action === 'spend')) {
            return message.reply(`Action ${action} is not a valid treaty action! Valid actions are "give", "get", and "spend".`);
        }

        if (ownerFamily.name == family_name) {
            return message.reply(`You can't give treaty to yourself!`)
        }

        let targetFamily = await DbUtil.get_family(family_name, guild_id);
        if (targetFamily == null) {
            return message.reply(`I was unable to find a family with name ${family_name}, please run the command /family --all to see all the families currently in play for your guild, and then run the command /set-family to set your family.`);
        }
        let reply = "";
        let do_update = false;

        let bonus = 1;
        if (args.bonus ) { //user provided a custom bonus
            bonus = parseInt(args.bonus, 10 );
        }

        if (action === "give") {
            ownerFamily.giveTreatyTo(targetFamily, bonus);
            reply = `${ownerFamily.name} gave ${bonus}-Treaty to ${targetFamily.name}`;
            do_update = true;
        } else if (action === "get") {
            ownerFamily.receiveTreatyFrom(targetFamily, bonus);
            reply = `${ownerFamily.name} received ${bonus}-Treaty from ${targetFamily.name}`;
            do_update = true;
        } else { //spend
            if (!ownerFamily.hasTreatyWith(targetFamily)) {
                reply = `No treaty spent: ${ownerFamily.name} does not have treaty with ${targetFamily.name}`;
            }
            else if( !ownerFamily.hasEnoughTreaty( targetFamily, bonus ) ) {
                reply = `You do not have enough treaty with "${targetFamily.name}" to spend ${bonus} treaty`;
            }
            else {
                ownerFamily.spendsTreatyWith(targetFamily, bonus);
                do_update = true;
                reply = `${ownerFamily.name} spent ${bonus}-Treaty with ${targetFamily.name}`;
            }
        }
        if (do_update) {
            await DbUtil.update_family(targetFamily, 'treaties', targetFamily.treaties);
            await DbUtil.update_family(ownerFamily, 'treaties', ownerFamily.treaties);
        }
        return message.reply(reply);

    }

    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = TreatyCommand;
