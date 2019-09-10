const assert = require('assert');
const db = require('./db');
const FamilyPlaybook = require('./family_playbook');
const PingCommand = require('./commands/ping');
const NewFamilyCommand = require('./commands/new_family');

const Message = require('discord.js');

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
        assert.ok(family != null);
        assert.ok(family.playbook === 'Cultivator');
        assert.ok(family.name === 'Duhnah');
        family.reach = 1;
        assert.equal(1, family.reach);
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

describe('vivify family playbook ', () => {
    it('can persist a family playbook', () => {
        let familyName = 'Cultivator';
        let playbookName = 'duhnah';
        let family = new FamilyPlaybook(playbookName);
        family.name = familyName;
        family.reach = 1;
        let mydb = db.create();
        mydb.insert(family);
        mydb.find({ family_name : familyName }).then((docs) => {
            assert.ok(docs.length === 1);
            let insertedRec = docs[0];
            // rebuild it
            let vivifiedFamily = FamilyPlaybook.fromNedbDocument(insertedRec);
            assert.ok(vivifiedFamily instanceof FamilyPlaybook);
            assert.ok(vivifiedFamily.playbook === insertedRec.family_playbook);
            assert.ok(vivifiedFamily.name === insertedRec.family_name);
            assert.ok(vivifiedFamily.reach === insertedRec.family_reach);
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

describe('process new-family bot command', () => {
    it('can process a new family bot command', () => {
        let commandArgs = {
            "playbook": "The Cultivator",
            "name": "Duhnah"
        }

        let reply = NewFamilyCommand.reply( commandArgs )
        assert.ok( reply === `I created a new family named "${commandArgs.name}" with unsupported playbook "${commandArgs.playbook}"`);
    });
});

