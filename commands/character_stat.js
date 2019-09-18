const {Command} = require('discord-akairo');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const Discord = require('discord.js');
const CharacterPlaybook = require('../family_playbook');
const DbUtil = require('./dbutil');

class CharacterStatCommand extends Command {
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
                id: 'force',
                match: 'prefix',
                prefix: 'Force=',
                type: 'int',
                helptext: 'Set your Force',
                optional: false,
                default: null
            },
            {
                id: 'lore',
                match: 'prefix',
                prefix: 'Lore=',
                type: 'int',
                helptext: 'Set your Lore',
                optional: false,
                default: null
            },

            {
                id: 'steel',
                match: 'prefix',
                prefix: 'Steel=',
                type: 'int',
                helptext: 'Set your Steel',
                optional: false,
                default: null
            },
            {
                id: 'sway',
                match: 'prefix',
                prefix: 'Sway=',
                type: 'int',
                helptext: 'Set your Sway',
                optional: false,
                default: null
            },
        ];
        let aliases = ['character-stat', 'cs'];
        super(CommandsMetadata.getCommands().character_stat.id, {
            aliases: aliases,
            args: command_args
        });
        this.comments = `The ${aliases[0]} command lets you sets the named Character Stats. Run the set-character command if you don't yet have a character.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]}`,
                commentary: `Show your current character Stats.`
            },
            {
                command: `${aliases[1]} Force=1`,
                commentary: `Set your Force to 1.`
            },
            {
                command: `${aliases[1]} Force=1 Sway=-1`,
                commentary: `Set your Force to 1 and your Sway to -1.`
            },
            {
                command: `${aliases[1]} Force=1 Sway=-1 Steel=0`,
                commentary: `Set your Force to 1 and your Sway to -1 and your Steel to 0.`
            },
            {
                command: `${aliases[1]} Force=1 Sway=-1 Steel=0 Lore=2`,
                commentary: `Set your Force to 1 and your Sway to -1 and your Steel to 0 and your Lore to 2.`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    statsAsRichEmbed(character) {
        let re = new Discord.RichEmbed();
        re.setTitle(`Stats for ${character.name}`);
        re.addField(`Force`, character.force, true);
        re.addField(`Lore`, character.lore, true);
        re.addField(`Steel`, character.steel, true);
        re.addField(`Sway`, character.sway, true);

        return re;
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

        let user_id = message.member.user.id;
        let guild_id = message.guild.id;


        let character = await DbUtil.get_users_character(user_id, guild_id);

        if ( character == null ) {
            return message.reply(`You have not set your character set -- please run \'set-character\` first!`);
        }
        if (!(args.force || args.lore || args.steel || args.sway ) ) { //no arg case
            return message.reply( this.statsAsRichEmbed(character));
        }

        let statsToUpdate = {};
        if (args.force) {
            statsToUpdate.force = args.force;
        }
        if (args.lore) {
            statsToUpdate.lore = args.lore;
        }
        if (args.steel) {
            statsToUpdate.steel = args.steel;
        }
        if (args.sway) {
            statsToUpdate.sway = args.sway;
        }

        await DbUtil.update_character(character, statsToUpdate);
        return message.reply(`updated ${JSON.stringify(statsToUpdate)} for character "${character.name}"`);
    }


    exec(message, args) {
        return this.aexec(message,args);
    }

}

module.exports = CharacterStatCommand;
