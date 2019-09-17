const mongoose = require('mongoose');
const CharacterPlaybook = require('../character_playbook');
const PlaybookSchema = require('./playbook');
const extendSchema = require('./extend_schema');

const CPlaybookSchema = extendSchema(PlaybookSchema, {});

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

