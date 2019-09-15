const {db} = require('../bot');
const FamilyPlaybook = require('../family_playbook');
const CharacterPlaybook = require('../character_playbook');

class DbUtil {
    static async update_family(family, updateKey, updateValue) {
        return await db.update({
            guild_id: family.guild_id,
            family_name: family.name,
        }, {$set: {[updateKey]: updateValue}}, []).then((updatedDocs) => {
            return updatedDocs;
        }).catch((err) => {
            return err;
        });
    }

    static async update_family_multiple_values(family, updateValues) {
        return await db.update({
            guild_id: family.guild_id,
            family_name: family.name,
        }, {$set: updateValues }, []).then((updatedDocs) => {
            return updatedDocs;
        }).catch((err) => {
            return err;
        });
    }

    static async get_family(family_name, guild_id) {
        return await db.find({family_name: family_name, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static async get_family_by_playbook(playbook_name, guild_id) {
        return await db.find({family_playbook: playbook_name, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static async get_users_family(user_id, guild_id) {
        return await db.find({user_id: user_id, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });
    }

    static async get_guilds_families(guild_id) {
        let ret = [];
        await db.find({guild_id: guild_id}).then((docs) => {
            for( var i = 0; i < docs.length; i++ ) {
                ret.push( FamilyPlaybook.fromNedbDocument(docs[i]));
            }
        }).catch((err) => {
        });
        return ret;
    }

    static async insert_family( user_id, guild_id, playbook_name, family_name ) {
        let newFamily = new FamilyPlaybook( playbook_name, guild_id );
        newFamily.playbook_user_id = user_id;
        newFamily.name = family_name;

        return await db.insert(newFamily)
            .then(() => {
                return(`created new family: ${JSON.stringify(newFamily)}`);
            })
            .catch((err) => {
                return(`insert failed! ${err}`);
            });
    }


    static async insert_character(character_name, playbook_name, guild_id, family_name, db_override=null ) {
        let mydb = null;
        if ( db_override) { //needed for unit testing.
            mydb = db_override;
        }
        else {
            mydb = db;
        }
        let newCharacter = new CharacterPlaybook( character_name, playbook_name, guild_id, family_name);

        return await mydb.insert(newCharacter)
            .then(() => {
                return(`created new character: ${JSON.stringify(newCharacter)}`);
            })
            .catch((err) => {
                return(`insert failed! ${err}`);
            });
    }

    static async get_character(character_name, guild_id, family_name, db_override=null) {
        let mydb = null;
        if ( db_override) { //needed for unit testing.
            mydb = db_override;
        }
        else {
            mydb = db;
        }
        return await mydb.find({character_name: character_name, guild_id: guild_id, family_name: family_name}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return CharacterPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static async get_users_character(user_id, guild_id, db_override=null) {
        let mydb = null;
        if ( db_override) { //needed for unit testing.
            mydb = db_override;
        }
        else {
            mydb = db;
        }
        return await mydb.find({character_user_id: user_id, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return CharacterPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });
    }

    static async get_character_by_playbook(playbook_name, guild_id, db_override=null) {
        let mydb = null;
        if ( db_override) { //needed for unit testing.
            mydb = db_override;
        }
        else {
            mydb = db;
        }
        return await mydb.find({character_playbook: playbook_name, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return CharacterPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static async update_character(character, updateKey, updateValue, db_override=null) {
        let mydb = null;
        if ( db_override) { //needed for unit testing.
            mydb = db_override;
        }
        else {
            mydb = db;
        }
        return await mydb.update({
            guild_id: character.guild_id,
            character_name: character.name,
        }, {$set: {[updateKey]: updateValue}}, []).then((updatedDocs) => {
            return updatedDocs;
        }).catch((err) => {
            return err;
        });
    }




}
module.exports = DbUtil;