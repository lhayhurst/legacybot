const config = require('config');
const db = require('./db.js');

const {AkairoClient} = require('discord-akairo');

const client = new AkairoClient({
    ownerID: config.get('LegacyBotOwnerID'),
    prefix: config.get('LegacyBotCommandPrefix'), // or ['?', '!']
    commandDirectory: './commands/',
    allowMention: true
}, {
    disableEveryone: true
});

const legacyDb = db.create("./legacy.db", true);

client.once('ready', () => {
    console.log('Ready!');
});


module.exports = {
    login: function () {
        client.login(config.get('LegacyBotToken'));
    },
    db: legacyDb
};
