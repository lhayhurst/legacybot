const Discord = require('discord.js');
const config = require('config');

class HelpEmbed {
    constructor(name, aliases, args, comments,  examples = null) {
        this.name = name;
        this.aliases = aliases;
        this.comments = comments;
        this.args = args;
        this.examples = examples;
    }

    findOptions() {
        let ret = [];
        for( var i = 0; i < this.args.length; i++ ) {
            let arg = this.args[i];
            if( arg.prefix) {
                ret.push(arg);
            }
        }
        return ret;
    }

    get embed() {
        let ret = new Discord.RichEmbed();

        let usageString = `${config.get('LegacyBotCommandPrefix')}${this.aliases[0]}`;

        this.options = this.findOptions();
        //this.commands = this.findCommands();
        //this.arguments = this.findArguments();

        if (this.options) {
            usageString += " [OPTIONS] ";
        }
        if (this.commands) {
            usageString += " COMMAND ";
        }
        if (this.arguments) {
            usageString += " [ARGS]..."
        }

        ret.setTitle(this.name)
        ret.addField(`Usage: `, usageString, true);
        ret.addField("Aliases:", `\t${JSON.stringify(this.aliases.slice(1, this.aliases.length))}` );
        ret.description = this.comments;

        return ret;
    }
}

module.exports = HelpEmbed;