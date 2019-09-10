const {Command} = require('discord-akairo');

class PingCommandReply {
    constructor(messageContent) {
        this.message = messageContent;
    }

    get reply() {
        return "You Bet!";
    }

}

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping']
        });
    }

    static reply(messageContent) {
        return new PingCommandReply(messageContent).reply;
    }

    exec(message, args) {
        return message.reply(PingCommand.reply(message.content));
    }
}

module.exports = PingCommand;
