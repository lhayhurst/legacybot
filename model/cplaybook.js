const mongoose = require('mongoose');
const CharacterPlaybook = require('../character_playbook');
const PlaybookSchema = require('./playbook');
const extendSchema = require('./extend_schema');

const CharacterSchema = {
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FPlaybook',
        default: null
    }
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

