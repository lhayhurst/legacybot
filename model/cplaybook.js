const mongoose = require('mongoose');
const CharacterPlaybook = require('../character_playbook');
const PlaybookSchema = require('./playbook');
const extendSchema = require('./extend_schema');

const CharacterSchema = {
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FPlaybook',
        default: null
    },
    looks: {
        type: String,
        default: null,
    },
    quick: {
        type: Boolean,
        default: false
    },
    dead: {
        type: Boolean,
        default: false
    },
    harm: {
        type: Boolean,
        default: false
    },
    character_moves: {
        type: [String],
        default: undefined
    },
    role_moves: {
        type: [String],
        default: undefined
    },
    notes: {
        type: String,
        default: null
    },
    force: {
        type: Number,
        default: 0
    },
    lore: {
        type: Number,
        default: 0
    },
    steel: {
        type: Number,
        default: 0
    },
    sway: {
        type: Number,
        default: 0
    },

};

const CPlaybookSchema = extendSchema(PlaybookSchema, CharacterSchema);

CPlaybookSchema.post('init',  doc => {
    //help the user out by looking up their playbook name
    let newName = CharacterPlaybook.find_stock_playbook(doc.playbook);
    if ( newName ) {
        doc.playbook = newName;
    }
});

let collectionName = "CharacterPlaybooks";
const CPlaybook = mongoose.model('CPlaybookSchema', CPlaybookSchema, collectionName);
module.exports = CPlaybook;

