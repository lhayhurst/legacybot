const {Command} = require('discord-akairo');
const Discord = require('discord.js');
const DbUtil = require('./dbutil');
const HelpEmbed = require('../view/help_embed');
const CommandsMetadata = require('./commands_metadata');
const FamilyPlaybookView = require('../view/family_playbook_view');
const Boom = require('./self_destructing_reply');
class TreatyCommand extends Command {
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
                helptext: 'Valid actions are \`give\`, \`get\`, and \`spend\`.',
            },
            {
                id: 'family',
                type: "string",
                default: null,
                argtype: "argument",
                helptext: 'The name of the family. Must be a quoted string if the Family name is more than one word.',
            },
            {
                id: 'bonus',
                match: 'prefix',
                prefix: '+',
                type: "int",
                default: null,
                helptext: 'A bonus if you want to give, get or spend more than 1-Treaty.',
                optional: true
            },

        ];
        let aliases =  ['treaty', 't'];
        super(CommandsMetadata.getCommands().treaty.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args
        });
        this.comments = `The ${aliases[0]} command lets you give, get, or spend Treaty (Core Rulebook, Second Edition page 37). For every other family in the game, you can have Treaty on them, and they can have Treaty on you. To get Treaty on them, use the get command. To give them treaty on you, use the give command. To spend treaty with them, use spend. To see your current treaties, just type in \`${aliases[0]}\`. Note, you can give or get multiple treaty by using the \`+\` options, for example \`+2\`.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]}`,
                commentary: `Show your current treaties.`
            },
            {
                command: `${aliases[1]} give Warboys`,
                commentary: `Give the Warboys 1-Treaty`
            },
            {
                command: `${aliases[1]} get "The Bullet Farm" +2`,
                commentary: `Get from "The Bullet Farm" 2-Treaty`
            },
            {
                command: `${aliases[1]} spend "The Bullet Farm" +2`,
                commentary: `Spend 2-Treaty with the Bullet Farm`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ]
    }




    async doexec(message, args) {

        if ( args.help ) {
            return Boom.self_destruct( message,  new HelpEmbed(
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
            return Boom.self_destruct( message, `You have not set your family set -- please run "/set-family 'family name'" before running the treaty command!`);
        }

        if (family_name == null && action == null) {
            let richEmbed = new Discord.RichEmbed();
            let view = new FamilyPlaybookView(ownerFamily);
            await view.visitTreaties(ownerFamily, richEmbed)
            return Boom.self_destruct( message, richEmbed);
        }
        if (!(action === 'give' || action === 'get' || action === 'spend')) {
            return Boom.self_destruct( message, `Action ${action} is not a valid treaty action! Valid actions are "give", "get", and "spend".`);
        }

        if (ownerFamily.name == family_name) {
            return Boom.self_destruct( message, `You can't give treaty to yourself!`)
        }

        let targetFamily = await DbUtil.get_family(family_name, guild_id);
        if (targetFamily == null) {
            return Boom.self_destruct( message, `I was unable to find a family with name ${family_name}, please run the command /family --all to see all the families currently in play for your guild, and then run the command /set-family to set your family.`);
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
            await DbUtil.update_family(targetFamily, {'treaties' : targetFamily.treaties } );
            await DbUtil.update_family(ownerFamily,  { 'treaties' : ownerFamily.treaties } );
        }
        return Boom.self_destruct( message, reply);

    }

    exec(message, args) {
        return this.doexec(message, args);
    }
}

module.exports = TreatyCommand;
