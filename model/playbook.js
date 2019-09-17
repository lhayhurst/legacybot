const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const PlaybookSchema = new mongoose.Schema({
    created_by_user_id: {type: String, required: true},
    guild_id: {type: String, required: true},
    playbook: {type: String, required: true},
    name: {type: String, default: null },
    managed_by_user_id: { type: String, default: null },
    managed_by_username: { type: String, default: null }
});

PlaybookSchema.index( { playbook: 1, guild_id: 1 }, { unique: true } );

module.exports = PlaybookSchema;

