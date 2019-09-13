const {db} = require('../bot');
const FamilyPlaybook = require('../family_playbook');

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

    static async insert_family( user_id, guild_id, playbook_name, family_name ) {
        let newFamily = new FamilyPlaybook( playbook_name, guild_id );
        newFamily.user_id = user_id;
        newFamily.name = family_name;

        return await db.insert(newFamily)
            .then(() => {
                console.log(`created new family: ${JSON.stringify(newFamily)}`);
            })
            .catch((err) => {
                console.log(`insert failed! ${err}`);
            });
    }

}
module.exports = DbUtil;