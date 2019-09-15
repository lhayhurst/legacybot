const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const droll = require('droll');
const CommandsMetadata = require('./commands_metadata');
const HelpEmbed = require('./help_embed');

class RollCommand extends Command {
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
                    id: 'bonus',
                    match: 'prefix',
                    prefix: 'b=',
                    type: "int",
                    default: null,
                    helptext: 'Add an bonus on top',
                    optional: true
                },
                {
                    id: 'stat',
                    match: 'prefix',
                    prefix: '+',
                    default: null,
                    helptext: 'Add a modifier to the role for the named Stat value. Use +R or +r or +Reach for reach, +S or +s or +Sleight for sleight, and +G or +g or +Grasp for grasp.',
                    optional: true
                },
                {
                    id: 'advantage',
                    match: 'flag',
                    prefix: '-a',
                    default: null,
                    helptext: 'Roll with advantage (3d6, drop lowest)',
                    optional: true
                },
                {
                    id: 'disadvantage',
                    match: 'flag',
                    prefix: '-d',
                    default: null,
                    helptext: 'Roll with disadvantage (3d6, drop highest)',
                    optional: true
                },
                {
                    id: 'family',
                    match: 'flag',
                    prefix: '-f',
                    default: true,
                    helptext: 'Family roll. Defaults to true.',
                    optional: true
                },
                {
                    id: 'character',
                    match: 'flag',
                    prefix: '-c',
                    default: null,
                    helptext: 'Character roll. Defaults to false.',
                    optional: true
                }
            ];
        let aliases =  ['roll', 'r'];
        super(CommandsMetadata.getCommands().roll.id, {
            aliases: aliases,
            args: command_args
        });
        this.comments = `This command lets you roll some dice! Behind the scenes it is using the [droll Javascript library](https://github.com/thebinarypenguin/droll). All dice roll commands can be mixed and matched for full flexibility.`;
        this.command_args = command_args;
        this.examples = [
            {
                command: aliases[0],
                commentary: `Rolls a straight 2d6`
            },
            {
                command: `${aliases[1]} -a`,
                commentary: `Rolls with advantage (3d6, drop lowest)`
            },
            {
                command: `${aliases[1]} -d`,
                commentary: `Rolls with disadvantage (2d6, drop heighest)`
            },
            {
                command: `${aliases[1]} -b=2`,
                commentary: `Rolls and adds bonus of 2 to the end`
            },
            {
                command: `${aliases[1]} +Sleight`,
                commentary: `Rolls and adds (or substracts) the Family Sleight stat`
            },
            {
                command: `${aliases[1]} +g -a`,
                commentary: `Rolls with advantage and Grasp stat`
            },
            {
                command: `${aliases[1]} +R -a -b=2`,
                commentary: `Rolls with advantage and Reach stat with a bonus of 2`
            },
            {
                command: `${aliases[1]} --help`,
                commentary: `Gets help on this command.`
            }
        ];
    }

    removeSmallest(arr) {
        arr.sort(function (a, b) {
            return a - b
        }); //sort it, low to high
        return arr.shift();
    }

    removeLargest(arr) {
        arr.sort(function (a, b) {
            return b - a
        }); //sort it, high to low
        return arr.shift();
    }


    async aexec(message, args) {

        let modifier = 0;
        let usingModifier = false;
        let stat = args.stat;
        let validStats = ['r', 'reach', 'Reach', 'g', 'grasp', 'Grasp', 's', 'sleight', 'Sleight']

        if ( args.help ) {
            return message.reply( new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        if (stat) {
            if (validStats.indexOf(stat) === -1) {
                return message.reply(`You gave me a stat that I didn't recognize. Valid stats are: ${JSON.stringify(validStats)} `);
            }
            //its a good stat, but now we have to make sure that the player has a family
            let guild_id = message.guild.id;
            let user_id = message.member.user.id;
            let ownerFamily = await DbUtil.get_users_family(user_id, guild_id);
            if (ownerFamily == null) {
                return message.reply(`You gave me a valid stat but you haven't taken on a family or character yet. Please /sf or /sc if you want to roll with a stat modifier!`);
            }
            if (stat === 'r' || stat === 'reach' || stat === 'Reach') {
                if (ownerFamily.reach) {
                    usingModifier = true;
                    modifier += parseInt(ownerFamily.reach, 10);
                }
            } else if (stat === 'g' || stat === 'grasp' || stat === 'Grasp') {
                if (ownerFamily.grasp) {
                    usingModifier = true;
                    modifier += parseInt(ownerFamily.grasp, 10);
                }
            } else if (stat === 's' || stat === 'sleight' || stat == 'Sleight') {
                if (ownerFamily.sleight) {
                    usingModifier = true;
                    modifier += parseInt(ownerFamily.sleight, 10);
                }
            }
        }

        let formula = '2d6';

        if (args.advantage || args.disadvantage) {
            formula = '3d6';
        }

        if (args.bonus) {
            modifier += parseInt(args.bonus, 10);
            usingModifier = true;
        }


        if (usingModifier) {
            if (modifier > 0) {
                formula += `+${modifier}`;
            } else if (modifier < 0) {
                formula += `${modifier}`;
            }
        }


        let resultString = `rolled ${formula} `;
        let rollResult = droll.roll(formula);

        if (args.advantage) {
            resultString += `with advantage `;
            let minRemoved = this.removeSmallest(rollResult.rolls);
            resultString += `dropping lowest roll [${minRemoved}]. `;
        } else if (args.disadvantage) {
            resultString += `with disadvantage `;
            let maxRemoved = this.removeLargest(rollResult.rolls);
            resultString += `dropping highest roll [${maxRemoved}]. `;
        }

        const add = (a, b) => a + b

        rollResult.total = rollResult.rolls.reduce(add) + rollResult.modifier;

        let legacyResult = null;
        if (rollResult.total <= 6) {
            legacyResult = "Setback";
        } else if (rollResult.total < 10) {
            legacyResult = "Mixed Success";
        } else {
            legacyResult = "Full Success"
        }
        return message.reply(`${resultString}: ${rollResult.toString()}. ${legacyResult}!`);
    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}


module.exports = RollCommand;
