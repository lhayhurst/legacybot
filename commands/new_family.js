const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const FamilyPlaybook = require('../family_playbook');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');


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
                command: `${aliases[1]} -p="enclave" -n="The Brotherhood"` ,
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
        if ( args.help ) {
            return message.reply( this.helpEmbed );
        }
        if (args.name == null || args.playbook == null ) {
            return message.reply(`You need to provide both a playbook and name to create a new family. Please run this command with a --help for the details!`);
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
        let retMessage = await DbUtil.insert_family( null, guild_id, args.playbook, args.name );
        return message.reply(retMessage);
    }
    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = NewFamilyCommand;
