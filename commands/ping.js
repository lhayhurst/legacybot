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
        super('ping command', {
            aliases: ['ping']
        });
    }

    static reply(messageContent) {
        return new PingCommandReply(messageContent).reply;
    }

    exec(message, args) {
        return Boom.self_destruct( message, PingCommand.reply(message.content));
    }
}

module.exports = PingCommand;
