const mongoose = require('mongoose');
const FPlaybook = require('../model/fplaybook');
const CPlaybook = require('../model/cplaybook');
const assert = require('assert');
const DbUtil = require('../commands/dbutil');
mongoose.Promise = Promise;

function cleanup_collections() {
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
}

before(function (done) {
    mongoose.connect("mongodb://127.0.0.1/test",
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    );
    cleanup_collections();
    done();
});


let theCitadel;
let theSurvivor;
let guild_id = 1;
let user_id = 1;

beforeEach(function (done) {
    theCitadel = new FPlaybook({playbook: 'Tyrant', created_by_user_id: user_id, guild_id: guild_id});
    theSurvivor = new CPlaybook({playbook: 'The Survivor', name: "Max", created_by_user_id: user_id, guild_id: guild_id});
    done();
});

afterEach(function (done) {
    // runs after each test in this block
    theSurvivor = null;
    theCitadel = null;
    done();
});

after(function  (done) {
    mongoose.connection.close();
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
            assert.strictEqual(11000, err.code); //duplicate key error
        });
    });

    it('cannot create a duplicate name', async () => {
        let pb = new FPlaybook({playbook: 'Hive', name: "The Citadel", created_by_user_id: 1});
        await pb.save().catch((err) => {
            assert.ok(err);
            assert.strictEqual(err.name, "MongoError");
            assert.strictEqual(11000, err.code); //duplicate key error
        });
    });

});

describe('character playbook tests ', () => {
    it('can has a character', async () => {
        assert.ok(theSurvivor);
        assert.strictEqual(theSurvivor.name, "Max");
    });

    it('can save and search a character playbook', async () => {
        theSurvivor.managed_by_username = "me";
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
        let pb = new CPlaybook({playbook: 'Reaver', name: "Mad Max", created_by_user_id: 1, guild_id: 1});
        await pb.save().catch((err) => {
            assert.ok(err);
            assert.strictEqual(err.name, "MongoError");
            assert.strictEqual(11000, err.code); //duplicate key error
        });
    });

    it("can get_guild_characters", async () => {
        let characters = await DbUtil.get_guilds_characters(guild_id)
        assert.ok(characters.length > 0);
        let gc = characters[0];
        assert.strictEqual(gc.guild_id, theSurvivor.guild_id);
    });

    it("can get character by playbook", async () => {
        let gc = await DbUtil.get_character_by_playbook(theSurvivor.playbook, theSurvivor.guild_id);
        assert.ok(gc);
        assert.strictEqual(gc.guild_id, theSurvivor.guild_id);
        assert.strictEqual(gc.playbook, "The Survivor");
    });

});

describe('more character playbook tests ', () => {
    it("can get and update character for user", async () => {
        await theSurvivor.save().catch((err) => {
            assert.ok(!err);
        });

        let gc = await DbUtil.get_users_character(user_id, guild_id);
        assert.ok(gc == null);
        //as expected, not managed by anyone

        await DbUtil.update_character( theSurvivor, {managed_by_user_id: user_id});

        //let's try that again
        let newgc = await DbUtil.get_users_character(user_id, guild_id);
        assert.ok(newgc);
        assert.strictEqual(user_id, newgc.managed_by_user_id);

        //lets try it with the update character function!
        await DbUtil.update_character( newgc, {managed_by_username: 'me2'});
        let newgc2 = await DbUtil.get_users_character(newgc.managed_by_user_id, newgc.guild_id);
        assert.ok(newgc2);
        assert.strictEqual("me2", newgc2.managed_by_username);


    });


});
