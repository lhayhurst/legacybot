const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const droll = require('droll');
const CommandsMetadata = require('./commands_metadata');
const HelpEmbed = require('../view/help_embed');
const Boom = require('./self_destructing_reply');

class RollCommand extends Command {
    constructor() {
        let command_args =  [
                {
                    id: 'help',
                    match: 'flag',
                    prefix: '-h',
                    default: null,
                    helptext: 'Show this message',
                    optional: true
                },
            {
                id: 'keep',
                match: 'prefix',
                prefix: '-k=',
                default: 7,
                helptext: `Keep parameter for how many seconds you would like to keep this message before it self destructs. \`-k=10\` to keep for 10 seconds, for example. If value is \`-k=forever\`, it will keep forever!`,
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
                command: `${aliases[1]} -help`,
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
        Boom.keep(args.keep);

        let modifier = 0;
        let usingModifier = false;
        let stat = args.stat;

        //TODO: these belong in a meta-data file somewhere, eh?
        let reachStatAliases =  ['r',  'R', 'reach', 'Reach'];
        let graspStatAliases = [ 'g', 'G', 'grasp', 'Grasp'];
        let sleightStatAliases = ['s', 'S', 'sleight', 'Sleight'];
        let validFamilyStats = [ ...reachStatAliases, ...graspStatAliases, ...sleightStatAliases];

        let forceStatAliases = ['f', 'F', 'force', 'Force'];
        let loreStatAliases = ['l', 'L', 'lore', 'Lore'];
        let steelStatAliases = ['st', 'ST', 'steel', 'Steel'];
        let swayStatAliases = ['sw', 'SW', 'sway', 'Sway'];

        let validCharacterStats = [...forceStatAliases, ...loreStatAliases, ...steelStatAliases, ...swayStatAliases];

        if ( args.help ) {
            return Boom.self_destruct( message,  new HelpEmbed(
                this.id, //the name of the command
                this.command_args,
                this.aliases,  //its aliases
                this.comments,
                this.examples).embed);
        }

        if (stat) {
            let isFamilyStat = validFamilyStats.includes(stat);
            let isCharacterStat = validCharacterStats.includes(stat);
            if (!isFamilyStat && !isCharacterStat) {
                return Boom.self_destruct( message, `You gave me a stat that I didn't recognize. Valid stats for Families are ${JSON.stringify(validFamilyStats)}, and valid stats for Characters are  ${JSON.stringify(validCharacterStats)} `);
            }

            //so far so good.
            let guild_id = message.guild.id;
            let user_id = message.member.user.id;
            let userPlaybook = null;
            if ( isFamilyStat) {
                userPlaybook = await DbUtil.get_users_family(user_id, guild_id);
            }
            else {
                userPlaybook = await DbUtil.get_users_character(user_id, guild_id);
            }

            if (userPlaybook == null ) {
                return Boom.self_destruct( message, `You gave me a valid stat but you haven't taken on a playbook yet. Please \`.sf\` or \`.sc\` first.`);
            }
            if (reachStatAliases.includes(stat) ) {
                if (userPlaybook.reach) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.reach, 10);
                }
            } else if (graspStatAliases.includes(stat) ) {
                if (userPlaybook.grasp) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.grasp, 10);
                }
            } else if (sleightStatAliases.includes(stat) ) {
                if (userPlaybook.sleight) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.sleight, 10);
                }
            } else if ( forceStatAliases.includes(stat)) {
                if (userPlaybook.force ) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.force, 10);
                }
            }  else if ( loreStatAliases.includes(stat)) {
                if (userPlaybook.lore ) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.lore, 10);
                }
            }  else if ( steelStatAliases.includes(stat)) {
                if (userPlaybook.steel ) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.steel, 10);
                }
            }  else if ( swayStatAliases.includes(stat)) {
                if (userPlaybook.sway ) {
                    usingModifier = true;
                    modifier += parseInt(userPlaybook.sway, 10);
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


        let resultString = `rolled \`${formula}\` `;
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
        return message.reply( `${resultString}: ${rollResult.toString()}. ${legacyResult}!`);
    }

    exec(message, args) {
        return this.aexec(message, args);
    }
}


module.exports = RollCommand;
