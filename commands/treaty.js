const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const FamilyPlaybook = require('../family_playbook');
const {db} = require('../bot');

class TreatyCommand extends Command {
    constructor() {
        super('treaty', {
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
                }
            ]
        });
    }

    async get_family(family_name, guild_id ) {
        return await db.find( { family_name: family_name, guild_id: guild_id}).then((docs) => {
            if( docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch( (err ) => {
            return null;
        });

    }

    async get_users_family(user_id, guild_id ) {
        return await db.find( { user_id: user_id, guild_id: guild_id}).then((docs) => {
            if( docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch( (err ) => {
            return null;
        });
    }

    async update_family(family) {
        return await db.update( {guild_id: family.guild_id, family_name: family.name, }, {$set: { treaties: family.treaties} }, [ ]).then((updatedDocs) => {
        }).catch((err) => {
            return err;
        });

    }

    async doexec(message,args ) {
        let guild_id = message.guild.id;
        let family_name = args.family;
        let action = args.action;

        let ownerFamily = await this.get_users_family(message.member.user.id, guild_id );
        if (ownerFamily == null ) {
            return message.reply(`You have not set your family set -- please run "/set-family 'family name'" before running the treaty command!`);
        }

        if (family_name == null && action == null) {
            let richEmbed = new Discord.RichEmbed();
            ownerFamily.visitTreaties( richEmbed )
            return message.reply( richEmbed );
        }
        if (! ( action === 'give' || action === 'get' || action === 'spend') ) {
            return message.reply(`Action ${action} is not a valid treaty action! Valid actions are "give", "get", and "spend".`);
        }

        if ( ownerFamily.name == family_name ) {
            return message.reply(`You can't give treaty to yourself!`)
        }

        let targetFamily =  await this.get_family(family_name, guild_id );
        if (targetFamily == null ) {
            return message.reply(`I was unable to find a family with name ${family_name}, please run the command /family --all to see all the families currently in play for your guild, and then run the command /set-family to set your family.`);
        }
        let reply = "";
        let do_update = false;
        if ( action === "give") {
            ownerFamily.giveTreatyTo(targetFamily);
            reply = `${ownerFamily.name} gave 1 Treaty to ${targetFamily.name}`;
            do_update = true;
        }
        else if ( action === "get") {
            ownerFamily.receiveTreatyFrom( targetFamily );
            this.update_family(ownerFamily);
            reply = `${ownerFamily.name} received 1 Treaty from ${targetFamily.name}`;
            do_update = true;
        }
        else { //spend
            if ( ! ownerFamily.hasTreatyWith( targetFamily ) ) {
                reply = `No treaty spent: ${ownerFamily.name} does not have treaty with ${targetFamily.name}`;
            }
            ownerFamily.spendsTreatyWith( targetFamily );
            do_update = true;
            reply =`${ownerFamily.name} spent 1 Treaty with ${targetFamily.name}`;
        }
        if ( do_update) {
            await this.update_family(targetFamily);
            await this.update_family(ownerFamily);
        }
        return message.reply(reply);

    }

    exec(message, args) {
        return this.doexec(message,args);
    }
}

module.exports = TreatyCommand;
