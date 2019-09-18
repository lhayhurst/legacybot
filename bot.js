const config = require('config');
const {AkairoClient} = require('discord-akairo');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const client = new AkairoClient({
    ownerID: config.get('LegacyBotOwnerID'),
    prefix: config.get('LegacyBotCommandPrefix'), // or ['?', '!']
    commandDirectory: './commands/',
    allowMention: true
}, {
    disableEveryone: true
});

const dbURL = config.get("MongoDbURI");
mongoose.connect(dbURL,
    {useNewUrlParser: true, useUnifiedTopology: true});

//TODO: consider adding  { autoIndex: false } when enough docs are in the database!

mongoose.connection
    .once('open', () => {
        console.log("Opened connection to mongodb")
    })
    .on('error', (error) => {
        console.warn('Error : ', error);
    });

mongoose.connection.on('error', (error) => {
    console.warn('Error : ', error);
});


module.exports = {
    login: function () {
        client.login(config.get('LegacyBotToken'));
    }
};
