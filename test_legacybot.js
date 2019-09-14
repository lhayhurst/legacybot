const assert = require('assert');
const db = require('./db');
const FamilyPlaybook = require('./family_playbook');
const PingCommand = require('./commands/ping');
const NewFamilyCommand = require('./commands/new_family');
const set_family_stats = require('./commands/set_family_stats');

const config = require('config');

describe('can config', () => {
   it('should be able to get a config value', () => {
       let ownerID = config.get('LegacyBotOwnerID');
       let prefix = config.get('LegacyBotCommandPrefix');
       let token = config.get('LegacyBotToken');
       assert.ok( token != null && token.length > 0);
       assert.ok( prefix != null && prefix.length > 0);
       assert.ok( ownerID != null && ownerID.length > 0);

   })
});

describe('make db', () => {
    it('should be able to make a db', () => {
        let mydb = db.create();
        assert.ok(mydb != null);
    });
});

describe('query db', () => {
    it('should be able to query a db', () => {
        let mydb = db.create();
        let doc = { playbook: 'The Hive', n: 5 };
        mydb.insert(doc);
        mydb.find({ playbook: 'The Hive' }).then((docs) => {
            let foundDoc = docs[0];
            assert.ok(foundDoc.playbook === 'The Hive');
        }).catch(() => {
            assert.ok(false);
        });
    });
});

describe('create family playbook ', () => {
    it('can create a family playbook', () => {
        let family = new FamilyPlaybook('Cultivator');
        family.name = 'Duhnah';
        assert.ok(family.playbook === 'Cultivator');
        assert.ok(family.name === 'Duhnah');
        family.reach = 1;
        assert.ok(1 === family.reach);
    });
});

describe('persist family playbook ', () => {
    it('can persist a family playbook', () => {
        let playbookName = 'Cultivator';
        let familyName = 'duhnah';
        let family = new FamilyPlaybook(playbookName);
        family.name = familyName;
        family.reach = 1;
        let mydb = db.create();
        mydb.insert(family);
        mydb.find({ family_name : familyName }).then((docs) => {
            assert.ok(docs.length === 1);
            let insertedRec = docs[0];
            assert.ok(familyName === insertedRec.family_name);
            assert.ok(playbookName === insertedRec.family_playbook);
            assert.ok(insertedRec.family_reach === 1);
        }).catch(() => {
            assert.fail();
        });
    });
});

describe('process ping bot command', () => {
    it('can process a ping bot command', () => {
        let commandText = '/ping';
        assert.ok( PingCommand.reply( commandText ) === "You Bet!");
    });
});

describe('do treaty stuff', () => {
    it('can give and receive treaties for two families', () => {
        let fam1 = new FamilyPlaybook("The Cultivators", 1);
        let fam2 = new FamilyPlaybook("The Hive", 1);

        fam1.giveTreatyTo(fam2);
        assert.ok(fam1.treaties[fam2.name]);
        assert.equal(1, fam1.treaties[fam2.name].on_me );
        assert.ok(fam2.treaties[fam1.name]);
        assert.equal(1, fam2.treaties[fam1.name].me_on );

        assert.equal(true, fam1.hasTreatyWith(fam2));
        assert.equal(true, fam2.hasTreatyWith(fam1));

        fam2.spendsTreatyWith(fam1);
        assert.equal(0, fam2.treaties[fam1.name].me_on );
        assert.ok(fam2.treaties[fam1.name]);
        assert.equal(0, fam1.treaties[fam2.name].on_me );

        assert.equal(false, fam1.hasTreatyWith(fam2));
        assert.equal(false, fam2.hasTreatyWith(fam1));

        fam1.receiveTreatyFrom(fam2, 2);
        assert.equal(true, fam1.hasTreatyWith(fam2));
        assert.equal(true, fam2.hasTreatyWith(fam1));
        assert.equal(2, fam1.treaties[fam2.name].me_on );
        assert.equal(2, fam2.treaties[fam1.name].on_me );



    });
});



