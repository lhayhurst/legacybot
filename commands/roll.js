const {Command} = require('discord-akairo');
const DbUtil = require('./dbutil');
const droll = require('droll');

class RollCommand extends Command {
    constructor() {
        super('roll dicecommand', {
            aliases: ['roll', 'r', 'lr'],
            args: [
                {
                    id: 'bonus',
                    match: 'prefix',
                    prefix: 'b=',
                    type: "int",
                    default: null
                },
                {
                    id: 'stat',
                    match: 'prefix',
                    prefix: '+',
                    default: null
                },
                {
                    id: 'advantage',
                    match: 'flag',
                    prefix: '-a',
                    default: null
                },
                {
                    id: 'disadvantage',
                    match: 'flag',
                    prefix: '-d',
                    default: null
                },
                {
                    id: 'family',
                    match: 'flag',
                    prefix: '-f',
                    default: null
                },
                {
                    id: 'character',
                    match: 'flag',
                    prefix: '-c',
                    default: null
                }
            ],
        });
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
