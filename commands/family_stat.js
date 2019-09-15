const {Command} = require('discord-akairo');
const {db} = require('../bot');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');
const Discord = require('discord.js');
const FamilyPlaybook = require('../family_playbook');

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


    exec(message, args) {

        if ( args.help ) {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        let user_id = message.member.user.id;

        let statsToUpdate = {};

        db.find({user_id: user_id}).then((docs) => {
            if (docs.length === 0) {
                return message.reply(`You have not set your family set -- please run "/set-family 'family name'" first!`);
            }
            let id = docs[0]._id;
            let family = FamilyPlaybook.fromNedbDocument(docs[0])
            if (!(args.reach && args.grasp && args.sleight ) ) { //no arg case
                let re = new Discord.RichEmbed();
                re.setTitle(`Stats for ${family.name}`);
                re.addField(`Reach`, family.reach, true);
                re.addField(`Grasp`, family.grasp), true;
                re.addField(`Sleight`, family.sleight, true);
                return message.reply( re );
            }
            if (args.reach) {
                statsToUpdate.reach = args.reach;
            }
            if (args.sleight) {
                statsToUpdate.sleight = args.sleight;
            }
            if (args.grasp) {
                statsToUpdate.grasp = args.grasp;
            }
            if (args.family_data) {
                statsToUpdate.family_data = args.family_data;
            }
            if (args.tech) {
                statsToUpdate.tech = args.tech;
            }
            if (args.mood) {
                statsToUpdate.mood = args.mood;
            }

            db.update( {_id: id}, {$set: statsToUpdate}, [ ]).then((updatedDocs) => {
                return message.reply(`Updated your family "${docs[0].family_name}" with new stats ${JSON.stringify(statsToUpdate)}`)
            }).catch((err) => {
                return message.reply(`Something bad happened: ${err}`);
            });
        }).
        catch((err) => {
            return message.reply(`Something bad happened: ${err}`);
        });
    }
}

module.exports = FamilyStatCommand;
