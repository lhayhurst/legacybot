const mongoose = require('mongoose');
const FPlaybook = require('../model/fplaybook');
const CPlaybook = require('../model/cplaybook');
const assert = require('assert');
const DbUtil = require('../commands/dbutil');
mongoose.Promise = Promise;

before(function (done) {
    mongoose.connect("mongodb://127.0.0.1/test",
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    );
    mongoose.connection
        .once('open', () => {
            mongoose.connection.collections.FamilyPlaybooks.drop(() => {
            });
            mongoose.connection.collections.CharacterPlaybooks.drop(() => {
            });

        })
        .on('error', (error) => {
            console.warn('Error : ', error);
        });
    done();
});

after(function (done) {
    mongoose.connection.close();
    done();
    return;
});

let theCitadel;
let theSurvivor;
let guild_id = 1;
let user_id = 1;

beforeEach(function (done) {
    theCitadel = new FPlaybook({playbook: 'Tyrant', created_by_user_id: user_id, guild_id: guild_id });
    theSurvivor = new CPlaybook({playbook: 'Survivor', name: "Max", created_by_user_id: user_id, guild_id: guild_id });
    done();
});

afterEach(function (done) {
    // runs after each test in this block
    done();
});

describe('family playbook tests ', () => {

    it('can save and search a family playbook', async () => {
        theCitadel.name = "The Citadel";
        await theCitadel.save().then(() => {
        });

        //search by name
        await FPlaybook.find({name: theCitadel.name}).then((documents) => {
            assert.ok(documents);
            assert.strictEqual(1, documents.length);
            let family = documents[0];
            assert.equal(theCitadel.name, family.name);
        });

        //search all
        await FPlaybook.find({}).then((documents) => {
            assert.ok(documents);
            assert.strictEqual(1, documents.length);
        });

        //search using findOne
        await FPlaybook.findOne({name: theCitadel.name}).then((doc) => {
            assert.ok(doc);
            let family = doc;
            assert.equal(theCitadel.name, family.name);
        });
    });

    it('cannot create a duplicate playbook', async () => {
        let pb = new FPlaybook({playbook: 'Tyrant', created_by_user_id: 1});
        await pb.save().catch((err) => {
            assert.ok(err);
            assert.strictEqual(err.name, "MongoError");
            assert.strictEqual(11000, err.code ); //duplicate key error
        });
    });

    it('cannot create a duplicate name', async () => {
        let pb = new FPlaybook({playbook: 'Hive', name: "The Citadel", created_by_user_id: 1});
        await pb.save().catch((err) => {
            assert.ok(err);
            assert.strictEqual(err.name, "MongoError");
            assert.strictEqual(11000, err.code ); //duplicate key error
        });
    });

});

describe('character playbook tests ', () => {
    it( 'can has a character', async() => {
       assert.ok(theSurvivor);
       assert.strictEqual(theSurvivor.name, "Max");
    });

    it('can save and search a character playbook', async () => {
        theSurvivor.name = "Mad Max";
        await theSurvivor.save().then(() => {
        });

        //search by name
        await CPlaybook.find({name: theSurvivor.name}).then((documents) => {
            assert.ok(documents);
            assert.strictEqual(1, documents.length);
            let character = documents[0];
            assert.equal(theSurvivor.name, character.name);
        });

        //search all
        await CPlaybook.find({}).then((documents) => {
            assert.ok(documents);
            assert.strictEqual(1, documents.length);
        });

        //search using findOne
        await CPlaybook.findOne({name: theSurvivor.name}).then((doc) => {
            assert.ok(doc);
            let character = doc;
            assert.equal(theSurvivor.name, character.name);
        });
    });

    it('cannot create a duplicate character name', async () => {
        let pb = new CPlaybook({playbook: 'Reaver', name: "Mad Max", created_by_user_id: 1, guild_id: 1 });
        await pb.save().catch((err) => {
            assert.ok(err);
            assert.strictEqual(err.name, "MongoError");
            assert.strictEqual(11000, err.code ); //duplicate key error
        });
    });

    it("can get_guild_characters", async () => {
        let characters = await DbUtil.get_guilds_characters(guild_id)
        assert.ok(characters.length >0) ;
        let gc = characters[0];
        assert.strictEqual(gc.guild_id, theSurvivor.guild_id );

    });



});
