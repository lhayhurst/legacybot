const {Command} = require('discord-akairo');
const FamilyPlaybook = require('../family_playbook');
const HelpEmbed = require('./help_embed');
const CommandsMetadata = require('./commands_metadata');

class SetFamilyCommand extends Command {
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
                id: 'name',
                split: 'quoted',
                type: 'string',
                optional: false,
                argtype: "argument",
                helptext: `The name of the Family you are adopting. Run the families command to see what families are currently in play.`
            }
        ];
        let aliases =  ['set-family', 'sf']
        super(CommandsMetadata.getCommands().set_family.id, {
            aliases: aliases,
            split: 'quoted',
            args: command_args
        });
        this.comments = `The ${aliases[0]} command is needed for if you want to run any Family specific related commands like need, surplus, treaty. Also, when you roll dice, if you've set your family, you can add stat modifiers to the dice rolls.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: `${aliases[1]} Warboys`,
                commentary: `Sets the Warboys as your Family.`
            },
            {
                command: `${aliases[1]} "Durnk Bots"`,
                commentary: `Sets the Durnk Bots as your Family.`
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
        db.database.find({family_name: args.name, guild_id: message.guild.id}).then((docs) => {
            if (docs.length === 0) { //no family found with that name
                return message.reply(`No family found with name ${args.name}!`);
            } else { //it already exists, just let the user know
                let insertedRec = docs[0];
                let vivifiedFamily = FamilyPlaybook.fromNedbDocument(insertedRec);
                let user_id = message.member.user.id;
                if (vivifiedFamily.user && vivifiedFamily.user !== user_id) {
                    return message.reply(`That family is already set to a different user ('${message.member.user.username}') `);
                }
                else if ( vivifiedFamily.user && vivifiedFamily.user === user_id) {
                    return message.reply(`You are already set to the family with name '${vivifiedFamily.name}'`);
                }
                db.update({family_name: vivifiedFamily.name}, {$set: {user_id: user_id, username: message.member.user.username }}, {}, (err, numReplaced) => {
                });
                //message.member.setNickname(vivifiedFamily.playbook);
                return message.reply(`you have set your family to ${vivifiedFamily.playbook} with name '${vivifiedFamily.name}'`);
            }
        }).catch((err) => {
            return message.reply(`Something terrible happened: ${err}`);
        });
    }
}

module.exports = SetFamilyCommand;
