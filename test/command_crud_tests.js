const mongoose = require('mongoose');
const FPlaybook = require('../model/fplaybook');
const CPlaybook = require('../model/cplaybook');
const assert = require('assert');
const DbUtil = require('../commands/dbutil');
const PropertyMagic = require('../commands/property_magic')
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

describe( `family view crud tests`, () => {
    let actions = PropertyMagic.PropertyActions();
    it("can get enums ", async () => {
        assert.strictEqual( actions.SET, 'set');
    });


    it("process simple string commands", async () => {
        await theCitadel.save();
        let args = { property_action: actions.SET,
            property_name: 'notes', property_value: "noted!" };
        let pm = new PropertyMagic(
            PropertyMagic.FamilyStringProperties(),
            PropertyMagic.FamilyArrayofStringProperties()
        );

        await pm.process( args, theCitadel);
        assert.strictEqual( theCitadel.notes, "noted!");
        assert.strictEqual( theCitadel.isModified(), true);

        args = { property_action: actions.SET,
            property_name: 'lifestyle', property_value: "Nomadic" };
        await pm.process( args, theCitadel);
        assert.strictEqual( theCitadel.lifestyle, "Nomadic");
        assert.strictEqual( theCitadel.isModified(), true);

        args = { property_action: actions.SET,
            property_name: 'doctrine', property_value: "Preservers of the Seas" };
        await pm.process( args, theCitadel);
        assert.strictEqual( theCitadel.doctrine, "Preservers of the Seas");
        assert.strictEqual( theCitadel.isModified(), true);

        //set looks good. let's try get
        args.property_action = actions.GET;
        let result = await pm.process(args, theCitadel);
        assert.strictEqual( result, "doctrine is "+theCitadel.doctrine );

        //and add
        args.property_action = actions.ADD;
        args.property_value = ", the Deep";
        await pm.process(args, theCitadel);
        assert.strictEqual( "Preservers of the Seas, the Deep", theCitadel.doctrine);

        //finally delete
        args.property_action = actions.REMOVE;
        await pm.process(args, theCitadel);
        assert.strictEqual( theCitadel.doctrine, null );

        //check some stuff that shouldn't work
        args.property_action = "foo";
        args.property_name = "bar";
        let res = await pm.process(args, theCitadel);
        assert.strictEqual(res, `Sorry, didn't know what to do with ${args.property_name} and ${args.property_action}, nothing changed`)
    });

    it("process string array commands", async () => {
        await theCitadel.save();

        let pm = new PropertyMagic(
            PropertyMagic.FamilyStringProperties(),
            PropertyMagic.FamilyArrayofStringProperties()
        );


        let args = { property_action: actions.ADD,
            property_name: 'traditions', property_value: "Aquatic Cyborgs" };

        await pm.process( args, theCitadel);
        assert.strictEqual( theCitadel.traditions.length, 1);
        assert.strictEqual( theCitadel.traditions[0],"Aquatic Cyborgs" );
        assert.strictEqual( theCitadel.isModified(), true);

        args = { property_action: actions.REMOVE,
            property_name: 'traditions', property_value: "Aquatic Cyborgs" };

        await pm.process( args, theCitadel);
        assert.strictEqual( theCitadel.traditions.length, 0);
        assert.strictEqual( theCitadel.isModified(), true);

    });

});