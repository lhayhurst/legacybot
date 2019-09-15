const Discord = require('discord.js');
const config = require('config');

class HelpEmbed {
    constructor(command_name, command_args, command_aliases, comments, examples) {
        this.name = command_name;
        this.command_args = command_args;
        this.aliases = command_aliases;
        this.comments = comments;
        this.examples = examples;
        this.options = this.findOptions();

    }

    findOptions() {
        let ret = [];
        for (var i = 0; i < this.command_args.length; i++) {
            let arg = this.command_args[i];
            if (arg.prefix) {
                ret.push(arg);
            }
        }
        return ret;
    }

    get embed() {
        let ret = new Discord.RichEmbed();

        let usageString = `${config.get('LegacyBotCommandPrefix')}${this.aliases[0]}`;

        if (this.command_args) {
            usageString += " [OPTIONS] ";
        }
        if (this.commands) {
            usageString += " COMMAND ";
        }
        if (this.arguments) {
            usageString += " [ARGS]..."
        }

        ret.setTitle(this.name)
        ret.setDescription(this.comments);
        ret.addField(`Usage: `, usageString, false);
        ret.addField("Command aliases:", `\t${JSON.stringify(this.aliases)}`);
        if ( this.command_args ) {
            ret.addField( "Options", this.optionsHelpText );
        }
        if( this.examples) {
            ret.addField( "Command examples", this.examplesHelpText);
        }
        ret.setFooter(`Have a bug to file? Needs more help? Visit https://github.com/lhayhurst/legacybot/issues`,
            `https://cdn.discordapp.com/embed/avatars/0.png`);

        return ret;
    }

    get examplesHelpText() {
        let ret = ``;
        for( var i = 0; i < this.examples.length; i++ ) {
            let example = this.examples[i];
            ret+= `\`${config.get("LegacyBotCommandPrefix")}${example.command}\`\t${example.commentary}\n`;
        }
        return ret;
    }

    get optionsHelpText() {
        let ret = ``;
        for( var i = 0; i < this.options.length; i++ ) {
            let opt = this.options[i];
            ret += `\t${opt.prefix}\t`;
            ret += `${opt.helptext}\t`;
            if( opt.optional ) {
                ret += "[optional]"
            }
            ret += "\n"
        }
        return ret;
    }
}

module.exports = HelpEmbed;