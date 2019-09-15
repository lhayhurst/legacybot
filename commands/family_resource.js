const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');

class FamilyResourceCommand extends Command {
    constructor() {
        let command_args =  [
            {
                id: 'help',
                match: 'flag',
                prefix: '--h',
                default: null,
                helptext: 'Show this message',
                optional: true
            },
            {
                id: 'action',
                type: "string",
                default: null,
                argtype: "command",
                helptext: 'Valid actions are \`get\`, and \`spend\`.',
                optional: false
            },
            {
                id: 'resource',
                type: "string",
                default: null,
                argtype: "argument",
                helptext: 'The type of resource to get or spend. Valid types are \`Tech\` (or \`tech\`) and \`Data\` (or \`data\`).',
                optional: false
            },
            {
                id: 'bonus',
                match: 'prefix',
                prefix: '+',
                type: "int",
                default: null,
                helptext: 'A bonus to the amount you get or spend. By default, it will be 1.',
                optional: true
            },

        ];
        let aliases =  ['family-resource', 'fr'];
        super(CommandsMetadata.getCommands().family_resource.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args
        });
        this.comments = `The ${aliases[0]} command lets you get or spend Tech and Data resources (Core Rulebook, Second Edition page 24). Mood is set automatically as per page 36 on the CRB-- total number of Surpluses - total number of Needs. Note, you can get or spend multiple resources by using the \`+\` options, for example \`+2\`.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]}`,
                commentary: `Show your current resources.`
            },
            {
                command: `${aliases[1]} get tech`,
                commentary: `Receive one tech`
            },
            {
                command: `${aliases[1]} spend tech +2`,
                commentary: `Spend two tech`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }


    async doexec(message, args) {

        if ( args.help ) {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        let guild_id = message.guild.id;
        let family_name = args.family;
        let action = args.action;

        let ownerFamily = await DbUtil.get_users_family(message.member.user.id, guild_id);
        if (ownerFamily == null) {
            return message.reply(`You have not set your family set -- please run "/set-family 'family name'" before running the ${this.aliases[0]} command!`);
        }

        if (family_name == null && action == null) {
            let richEmbed = new Discord.RichEmbed();
            ownerFamily.visitResources(richEmbed)
            return message.reply(richEmbed);
        }
        if (!(action === 'get' || action === 'spend')) {
            return message.reply(`Action ${action} is not a valid ${this.aliases[0]} action! Valid actions are "get", and "spend".`);
        }

        let resource = args.resource.toLowerCase();
        if (!( resource === 'tech' || resource=== 'data') ) {
            return message.reply(`Only Tech and Data resources are valid resource types.`)
        }

        let bonus = 1;
        if (args.bonus ) { //user provided a custom bonus
            bonus = parseInt(args.bonus, 10 );
        }

        let update_val = null;
        if (action === "get") {
            if ( resource === 'tech' ) {
                ownerFamily.tech = ownerFamily.tech + bonus;
                update_val = ownerFamily.tech_resource_update;
            }
            else {
                ownerFamily.data_resource = ownerFamily.data_resource + bonus;
                update_val = ownerFamily.data_resource_update;
            }

        } else { //spend
            if ( resource === 'tech' ) {
                ownerFamily.tech = ownerFamily.tech - bonus;
                update_val = ownerFamily.tech_resource_update;
            }
            else {
                ownerFamily.data_resource = ownerFamily.data_resource - bonus;
                update_val = ownerFamily.data_resource_update;
            }
        }
        let update_int_val = Object.values(update_val)[0];
        if( update_int_val < 0 ) {
            return message.reply(`You can't spend more resources than you have!`);
        }
        await DbUtil.update_family_multiple_values(ownerFamily, update_val);

        return message.reply(`Updated ${resource} to ${Object.values(update_val)[0]}`);

    }

    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = FamilyResourceCommand;
