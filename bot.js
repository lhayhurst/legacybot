const config = require('config');
const {AkairoClient} = require('discord-akairo');

const client = new AkairoClient({
    ownerID: config.get('LegacyBotOwnerID'),
    prefix: config.get('LegacyBotCommandPrefix'), // or ['?', '!']
    commandDirectory: './commands/',
    allowMention: true
}, {
    disableEveryone: true
});

module.exports = {
    login: function () {
        client.login(config.get('LegacyBotToken'));
    }
};
