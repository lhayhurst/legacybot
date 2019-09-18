const mongoose = require('mongoose');
const FPlaybook = require('../model/fplaybook');
const CPlaybook = require('../model/cplaybook');
const assert = require('assert');
const DbUtil = require('../commands/dbutil');
mongoose.Promise = Promise;

async function cleanup_collections() {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteOne();
    }
}

before(function (done) {
    mongoose.connect("mongodb://127.0.0.1/test",
        {useNewUrlParser: true, useUnifiedTopology: true}
    );
    done();
});


let theCitadel;
let theSurvivor;
let guild_id = "1";
let user_id = "1";

beforeEach(async function () {
    theCitadel = new FPlaybook({playbook: 'Tyrant', created_by_user_id: user_id, guild_id: guild_id});
    theSurvivor = new CPlaybook({playbook: 'The Survivor', name: "Max", created_by_user_id: user_id, guild_id: guild_id});
});

afterEach( async function () {
    await cleanup_collections();    // runs after each test in this block
    theSurvivor = null;
    theCitadel = null;
});

after(function  (done) {
    mongoose.connection.close();
    done();
});

describe( `family search tests - one`, () => {
    it("can get families for a guild", async () => {
        theCitadel.name = "The Citadel";

        let families = await DbUtil.get_guilds_families(guild_id);
        assert.strictEqual(families.length, 0);

        await theCitadel.save().then(() => {
        });

        let newFamililies = await DbUtil.get_guilds_families(guild_id);
        assert.strictEqual(newFamililies.length, 1);
    });
});
describe( `family search tests - two`, () => {

    it("can get families for a user", async () => {
        theCitadel.managed_by_user_id = user_id;
        await theCitadel.save().then(() => {
        });
        let family = await DbUtil.get_users_family(user_id, guild_id);
        assert.ok( family._id );
        assert.strictEqual(user_id, family.managed_by_user_id);
        assert.strictEqual(guild_id, family.guild_id);
        assert.strictEqual( theCitadel._id.toString(), family._id.toString())
    });
});

describe( `family search tests - three`, () => {

    it("can get family by name", async () => {
        theCitadel.name = "Mad Max";

        await theCitadel.save().then(() => {
        });

        let family = await DbUtil.get_family_by_playbook(theCitadel.playbook, guild_id);
        assert.ok( family._id );
        assert.strictEqual(guild_id, family.guild_id);
        assert.strictEqual(family.playbook, "The Tyrant Kings");
    });
})

describe( `family search tests - four`, () => {

    it("can get family by playbook", async () => {

        await theCitadel.save().then(() => {
        });

        let family = await DbUtil.get_family(theCitadel.name, guild_id);
        assert.ok( family != null );
        assert.strictEqual(guild_id, family.guild_id);
        assert.strictEqual(family.name, theCitadel.name);
        assert.strictEqual( theCitadel._id.toString(), family._id.toString())
    });
});


describe( `test family update`, () => {

    it("can get family by playbook", async () => {

        await theCitadel.save().then(() => {
        });

        await DbUtil.update_family( theCitadel, { managed_by_user_id: user_id});

        let family = await DbUtil.get_family(theCitadel.name, guild_id);
        assert.ok( family != null );
        assert.strictEqual(guild_id, family.guild_id);
        assert.strictEqual(family.name, theCitadel.name);
        assert.strictEqual( family.managed_by_user_id, user_id );
        assert.strictEqual( theCitadel._id.toString(), family._id.toString())

    });
});

describe( `test family notes`, () => {

    it("can set notes", async () => {

        await theCitadel.save().then(() => {
        });

        await DbUtil.update_family( theCitadel, { notes: "Witness me!"});

        let family = await DbUtil.get_family(theCitadel.name, guild_id);
        assert.ok( family != null );
        assert.strictEqual(guild_id, family.guild_id);
        assert.strictEqual(family.name, theCitadel.name);
        assert.strictEqual( family.notes, "Witness me!" );
        assert.strictEqual( theCitadel._id.toString(), family._id.toString())

    });
});


describe( `test family treaty`, () => {

    it("test has treaty with, int treaty, give treaty, get treaty, spend treaty", async () => {

        bulletfarm = new FPlaybook({playbook: 'enclave', name: "Bulletfarm",
            created_by_user_id: user_id, guild_id: guild_id});

        theCitadel.name = "The Citadel";
        await theCitadel.save().then(() => {
        });

        await bulletfarm.save().then(() => {
        });

        //they start out having no treaty
        //assert.strictEqual( theCitadel.hasTreatyWith(bulletfarm), false );

        //let's deal
        //first init stuff. the helper methods should do this too.
        theCitadel.initTreatyFor( bulletfarm );
        assert.strictEqual(theCitadel.findTreatyWith(bulletfarm), 0 );

        bulletfarm.initTreatyFor( theCitadel );
        assert.strictEqual(bulletfarm.findTreatyWith(theCitadel), 0 );


        theCitadel.giveTreatyTo(bulletfarm, 1);
        assert.strictEqual(bulletfarm.findTreatyWith(theCitadel), 1 );
        theCitadel.giveTreatyTo(bulletfarm, 1);
        assert.strictEqual(bulletfarm.findTreatyWith(theCitadel), 2);


        theCitadel.receiveTreatyFrom(bulletfarm, 2);
        assert.strictEqual(theCitadel.findTreatyWith(bulletfarm), 2 );

        assert.strictEqual( theCitadel.hasEnoughTreaty( bulletfarm, 3), false);
        assert.strictEqual( theCitadel.hasEnoughTreaty( bulletfarm, 2), true);

        //finally!
        theCitadel.spendTreatyWith(bulletfarm, 1);
        assert.strictEqual(theCitadel.findTreatyWith(bulletfarm), 1 );

        await DbUtil.update_family(theCitadel, { 'treaties': theCitadel.treaties });
        await DbUtil.update_family(bulletfarm, { 'treaties': bulletfarm.treaties });


        //and let's make sure it saved ok!
        let chkCitadel = await DbUtil.get_family(theCitadel.name, theCitadel.guild_id);
        let chkBullet = await DbUtil.get_family(bulletfarm.name, bulletfarm.guild_id);
        assert.strictEqual(chkCitadel.findTreatyWith(chkBullet), 1 );
        assert.strictEqual(chkBullet.findTreatyWith(chkCitadel), 2 );


    });
});

describe( 'family mood tests',  () => {
    it( "can use virtual mood property", () => {
        assert.equal( theCitadel.mood, 0 );
        theCitadel.surpluses.push( "Mothers Milk");
        assert.equal(theCitadel.mood, 1 );
        theCitadel.needs.push("Bullets");
        assert.equal(theCitadel.mood, 0 );

        theCitadel.mood_override = 2;
        assert.equal(theCitadel.mood, 2 );
        theCitadel.needs.push("Gasoline");
        assert.equal(theCitadel.mood, 2 );

        theCitadel.mood_override = 0;
        assert.equal(theCitadel.mood, -1 );
        theCitadel.needs.push("Breeders"); //fuuuuriosssaa!!!
        assert.equal(theCitadel.mood, -2 );


    });
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
        let pb = new FPlaybook({playbook: 'Tyrant', guild_id: guild_id, created_by_user_id: user_id});

        await pb.save().catch((err) => {
            assert.ok(err);
            assert.strictEqual(err.name, "ValidationError");
        });
    });

    it('cannot create a duplicate name', async () => {
        let pb = new FPlaybook({playbook: 'Hive', name: "The Citadel", guild_id: guild_id, created_by_user_id: user_id});
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
        await theSurvivor.save();
        let characters = await DbUtil.get_guilds_characters(guild_id)
        assert.ok(characters.length > 0);
        let gc = characters[0];
        assert.strictEqual(gc.guild_id, theSurvivor.guild_id);
    });

    it("can get character by playbook", async () => {
        await theSurvivor.save();
        let gc = await DbUtil.get_character_by_playbook(theSurvivor.playbook, theSurvivor.guild_id);
        assert.ok(gc);
        assert.strictEqual(gc.guild_id, theSurvivor.guild_id);
        assert.strictEqual(gc.playbook, "The Survivor");
    });

    it("can get character by name", async () => {
        await theSurvivor.save();
        let gc = await DbUtil.get_character_by_name(theSurvivor.name, guild_id);
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

describe('character-family relationship', () => {
    it("can set the family relationship", async () => {
        //first save the survivor
        await theSurvivor.save().catch((err) => {
            assert.ok(!err);
        });

        //then save the citadel
        await theCitadel.save().catch((err) => {
            assert.ok(!err);
        });

        await DbUtil.update_character(theSurvivor, { family: theCitadel});

        //check to see that its all good
        let newgc = await DbUtil.get_character_by_playbook(theSurvivor.playbook, guild_id);
        //theCitadel = await DbUtil.get_character_by_playbook(theCitadel.playbook, guild_id)
        assert.ok( newgc );
        assert.strictEqual( theCitadel._id.toString(), newgc.family._id.toString()) ;

        //look it up by object id too
        let family = await DbUtil.get_family_by_object_id( theCitadel._id );
        assert.ok( family );
        assert.strictEqual( theCitadel._id.toString(), family._id.toString()) ;

    });
});

