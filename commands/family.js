const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');

class FamiliesCommand extends Command {
    constructor() {
        super('family command', {
            aliases: ['family', 'f'],
            split: 'quoted',
            args: [
                {
                    id: 'help',
                    match: 'flag',
                    prefix: '--h',
                    default: null
                },
                {
                    id: 'name',
                    match: 'prefix',
                    prefix: '--name=',
                    default: null
                },
                {
                    id: 'all',
                    match: 'flag',
                    prefix: '--all',
                    default: null
                }],
        });
    }

    async aexec(message, args) {
        let richEmbed = new Discord.RichEmbed();
        if (args.all) {
            richEmbed.setTitle('Families Created So Far');
        }
        let families = await DbUtil.get_guilds_families(message.guild.id);
        if ( families.length === 0 ) {
            return message.reply( `It seems your guild hasn't created any new families yet! Please run /help and try out the /new-family command first.`);
        }
        for( var i = 0; i < families.length; i++ ) {
            let family = families[i];
            if ( args.all || family.user_id == message.member.user.id ) {
                await family.visit(richEmbed, args.all );
            }
        }
        return message.reply(richEmbed);
    }

    exec(message, args) {
        return this.aexec( message, args);
    }
}


module.exports = FamiliesCommand;
