const {Command} = require('discord-akairo');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const Boom = require('./self_destructing_reply');

class FamilyStatCommand extends Command {
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
                id: 'reach',
                match: 'prefix',
                prefix: 'r=',
                type: 'int',
                helptext: 'Set your Reach',
                optional: true
            },
            {
                id: 'sleight',
                match: 'prefix',
                prefix: 's=',
                type: 'int',
                helptext: 'Set your Sleight',
                optional: true
            },
            {
                id: 'grasp',
                match: 'prefix',
                prefix: 'g=',
                type: 'int',
                helptext: 'Set your Grasp',
                optional: true
            },
        ];
        let aliases = ['family-stat', 'fs'];
        super(CommandsMetadata.getCommands().family_stat.id, {
            aliases: aliases,
            args: command_args
        });
        this.comments = `The ${aliases[0]} command lets you sets the named Stat (Legacy 2.0 Core Rulebook page 24), with the short-hand r for Reach (your Family's influence in the wider world), g for Grasp (your Family's ability to project force and maintain control of its assets), and s for Sleight (your Family's ability to hide their actions and misdirect others). The stat will be set for the family associated with the user. Run the set-family command if you don't yet have a family.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]}`,
                commentary: `Show your current Stats.`
            },
            {
                command: `${aliases[1]} g=1`,
                commentary: `Set your Grasp to 1.`
            },
            {
                command: `${aliases[1]} g=1 s=-1`,
                commentary: `Set your Grasp to 1 and your Sleight to -1.`
            },
            {
                command: `${aliases[1]} g=1 s=-1 r=0`,
                commentary: `Set your Grasp to 1 and your Sleight to -1 and your Grasp to 0.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    statsAsRichEmbed(family) {
        let re = new Discord.RichEmbed();
        re.setTitle(`Stats for ${family.name}`);
        re.addField(`Reach`, family.reach, true);
        re.addField(`Grasp`, family.grasp, true);
        re.addField(`Sleight`, family.sleight, true);
        return re;
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

        let user_id = message.member.user.id;
        let guild_id = message.guild.id;


        let userFamily = await DbUtil.get_users_family(user_id, guild_id);

        if ( userFamily == null ) {
            return Boom.self_destruct( message, `You have not set your family set -- please run \'set-family\` first!`);
        }
        if (!(args.reach || args.grasp || args.sleight ) ) { //no arg case
            return Boom.self_destruct( message,  this.statsAsRichEmbed(userFamily));
        }

        let statsToUpdate = {};
        if (args.reach) {
            statsToUpdate.reach = args.reach;
        }
        if (args.sleight) {
            statsToUpdate.sleight = args.sleight;
        }
        if (args.grasp) {
            statsToUpdate.grasp = args.grasp;
        }


        await DbUtil.update_family(userFamily, statsToUpdate);
        return Boom.self_destruct( message, `updated ${JSON.stringify(statsToUpdate)} for family "${userFamily.name}"`);
    }


    exec(message, args) {
        return this.aexec(message,args);
    }
}

module.exports = FamilyStatCommand;
