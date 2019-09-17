const FamilyPlaybook = require('../family_playbook');
const CharacterPlaybook = require('../character_playbook');
const CPlaybook = require('../model/cplaybook');
const FPlaybook = require('../model/fplaybook');


class DbUtil {
    static async update_family(family, updateKey, updateValue) {
        return await db.collection("test").update({
            guild_id: family.guild_id,
            family_name: family.name,
        }, {$set: {[updateKey]: updateValue}}, []).then((updatedDocs) => {
            return updatedDocs;
        }).catch((err) => {
            return err;
        });
    }

    static async update_family_multiple_values(family, updateValues) {
        return await DbUtil.db.collection("test").update({
            guild_id: family.guild_id,
            family_name: family.name,
        }, {$set: updateValues }, []).then((updatedDocs) => {
            return updatedDocs;
        }).catch((err) => {
            return err;
        });
    }

    static async get_family(family_name, guild_id) {
        return await db.collection("test").find({family_name: family_name, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static async get_family_by_playbook(playbook_name, guild_id) {
        return await db.collection("test").find({family_playbook: playbook_name, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static async get_users_family(user_id, guild_id) {
        return await db.collection("test").find({user_id: user_id, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return FamilyPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });
    }

    static async get_guilds_families(guild_id) {
        return await FPlaybook.find({guild_id: guild_id}).then((documents) => {
            return documents;
        });
    }

    static async get_character_by_name(character_name, guild_id) {
        return await db.collection("test").find({character_name: character_name, guild_id: guild_id}).then((docs) => {
            if (docs.length === 0) { //not found
                return null;
            }
            return CharacterPlaybook.fromNedbDocument(docs[0]);
        }).catch((err) => {
            return null;
        });

    }

    static get_character(character_name, guild_id, family_name) {
        return db.collection("test").find({character_name: character_name, guild_id: guild_id, family: family_name}, function(err, docs) {
            if (err) {
                throw err;
            }
            if (docs.length === 0) { //not found
                return null;
            }
            return CharacterPlaybook.fromNedbDocument(docs[0]);
        });
    }

    static async get_users_character(user_id, guild_id) {
        return await CPlaybook.findOne({managed_by_user_id: user_id, guild_id: guild_id}).then((doc) => {
            return doc;
        });
    }

    static async get_character_by_playbook(playbook_name, guild_id) {
        return await CPlaybook.findOne({playbook: playbook_name, guild_id: guild_id}).then((doc) => {
            return doc;
        });

    }

    static async update_character(character, update) {
        await CPlaybook.updateOne(
            {
                playbook: character.playbook,
                guild_id: character.guild_id,
                name: character.name,
            }, update ).then((updatedDoc) => {
                console.log(updatedDoc);
        });
    }

    static async update_character_multiple_values(character, updateValues) {
        return await db.collection("test").update({
            guild_id: character.guild_id,
            character_name: character.name,
        }, {$set: updateValues }, []).then((updatedDocs) => {
            return updatedDocs;
        }).catch((err) => {
            return err;
        });
    }

    static async get_guilds_characters(guild_id) {
        return await CPlaybook.find( { guild_id : guild_id });
    }




}
module.exports = DbUtil;