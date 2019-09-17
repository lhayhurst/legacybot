const config = require('config');
const mongoose = require('mongoose');
mongoose.connect(config.get("MongoDbURI"), {useNewUrlParser: true, useUnifiedTopology: true, createIndexes: true });
mongoose.connection.once('open', () => console.log("Connected to Mongodb!")).on('error', (error) => {
    console.warn(`Mongodb error: ${error}`)
});

module.exports = {
    collection: function (collectionName) {
        return mongoose.connection.collection(collectionName);
    }
};
