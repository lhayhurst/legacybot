const mongoose = require('mongoose');

const PlaybookSchema = new mongoose.Schema({
    created_by_user_id: {type: Number, required: true},
    playbook: {type: String, required: true, unique: true, readonly: true},
    chosen: {type: Boolean, default: false},
    name: {type: String, default: null, unique: true},
    guild_id: {type: Number, unique: true, readonly: true},
    managed_by_user_id: Number,
    managed_by_username: String,
});


module.exports = PlaybookSchema;

