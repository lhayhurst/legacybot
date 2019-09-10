const Datastore  = require('nedb-promises');

const createDb = (dbFileName, autoload) => {
    if (dbFileName == null) {
        return Datastore.create(); //for testing
    }
    let db = Datastore.create({ filename: dbFileName, autoload: autoload });
    return db;

};

module.exports = {
    create: function (dbFileName, autoload) {
        return createDb(dbFileName, autoload);
    }
};
