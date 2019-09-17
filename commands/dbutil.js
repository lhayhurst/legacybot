const FamilyPlaybook = require('../family_playbook');
const CharacterPlaybook = require('../character_playbook');
const CPlaybook = require('../model/cplaybook');
const FPlaybook = require('../model/fplaybook');


class DbUtil {

    static async update_family(family, update) {
        await FPlaybook.updateOne(
            {
                playbook: family.playbook,
                guild_id: family.guild_id,
                name: family.name,
            }, update ).then((updatedDoc) => {
        });
    }

    static async get_family(family_name, guild_id) {
        return await FPlaybook.findOne({name: family_name, guild_id: guild_id}).then((doc) => {
            return doc;
        });

    }

    static async get_family_by_playbook(playbook_name, guild_id) {
        return await FPlaybook.findOne({playbook: playbook_name, guild_id: guild_id}).then((doc) => {
            return doc;
        });
    }

    static async get_users_family(user_id, guild_id) {
        return await FPlaybook.findOne({managed_by_user_id: user_id, guild_id: guild_id}).then((doc) => {
            return doc;
        });
    }

    static async get_guilds_families(guild_id) {
        return await FPlaybook.find({guild_id: guild_id}).then((documents) => {
            return documents;
        });
    }

    static async get_character_by_name(character) {
        return await CPlaybook.findOne( { name: character.name, guild_id: character.guild_id }).then((doc) => {
           return doc;
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
        });
    }

    static async get_guilds_characters(guild_id) {
        return await CPlaybook.find( { guild_id : guild_id });
    }




}
module.exports = DbUtil;