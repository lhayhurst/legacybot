const mongoose = require('mongoose');

const PlaybookSchema = new mongoose.Schema({
    created_by_user_id: {type: Number, required: true},
    playbook: {type: String, required: true, unique: true, readonly: true},
    name: {type: String, default: null, unique: true},
    guild_id: {type: Number, unique: true, readonly: true},
    managed_by_user_id: { type: Number, default: null },
    managed_by_username: { type: String, default: null }
});

module.exports = PlaybookSchema;

