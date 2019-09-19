const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const FPlaybook = require('../model/fplaybook');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const Boom = require('./self_destructing_reply');

class NewFamilyCommand extends Command {
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
                id: 'playbook',
                match: 'prefix',
                prefix: 'p=',
                helptext: 'The playbook to use for the family',
                default: null
            },
            {
                id: 'name',
                match: 'prefix',
                prefix: 'n=',
                default: null,
                helptext: 'The name of the family. Must be unique!'
            }
        ];
        let aliases =  ['new-family', 'nf'];
        super(CommandsMetadata.getCommands().new_family.id, {
            aliases: aliases,
            split: 'sticky',
            args: command_args
        });
        this.comments = `This will create a new family. If a family already exists with this name, nothing will happen--all family names must be unique! By creating a new family, that family is not assigned to the Discord user unless the user adds the family using the set-family command. The playbook may be one of the core Legacy family classes. Note, Legacybot will match your playbook string against existing playbooks; for example, setting your playbook to "hive" or "Hive" will result you creating a family from "The Synthetic Hive" playbook`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} p="enclave" n="The Brotherhood"` ,
                commentary: `Creates a new Family from the "Enclave of Bygone Lore" playbook with the name "The Brotherhood"`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }

    get helpEmbed() {
        return new HelpEmbed(
            this.id, //the name of the command
            this.command_args,
            this.aliases,  //its aliases
            this.comments,
            this.examples).embed;
    }

    async doexec(message, args) {
        let guild_id = message.guild.id;
        let user_id = message.member.user.id;

        if ( args.help ) {
            return Boom.self_destruct( message,  this.helpEmbed );
        }
        if (args.name == null || args.playbook == null ) {
            return Boom.self_destruct( message, `You need to provide both a playbook and name to create a new family. Please run this command with a --help for the details!`);
        }

        //check to see if this family name is already in use
        let existingFamily = await DbUtil.get_family(args.name, guild_id);
        if ( existingFamily ) {
            return Boom.self_destruct( message, `A family with the name "${existingFamily.name}" is already in play for this guild, please pick another name!"`);
        }

        //check to see if this playbook name is already in use
        let existingPlaybook = await DbUtil.get_family_by_playbook(args.playbook, guild_id);
        if ( existingPlaybook ) {
            return Boom.self_destruct( message, `A family with the playbook "${args.playbook}" is already in play for this guild, please pick another playbook!"`);
        }

        //check to see if this user already has a family
        let ownerFamily = await DbUtil.get_users_family(user_id, guild_id);
        if (ownerFamily !== null) {
            return Boom.self_destruct( message, `You have already set your family to the family with the name "${ownerFamily.name}". Please drop that family before taking on a new one!`);
        }

        //we're good to go. insert the new family
        let newFamily = new FPlaybook( { playbook: args.playbook,
            name: args.name,
            guild_id : guild_id,
            created_by_user_id : user_id
        });
        await newFamily.save();
        return Boom.self_destruct( message, "Created your family!");
    }
    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = NewFamilyCommand;
