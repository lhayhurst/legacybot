const mongoose = require('mongoose');
const FamilyPlaybook = require('../family_playbook');
const PlaybookSchema = require('./playbook');
const extendSchema = require('./extend_schema');

const FPlaybookSchema = extendSchema(PlaybookSchema, {});

FPlaybookSchema.post('init',  doc => {
    //help the user out by looking up their playbook name
    let newName = FamilyPlaybook.find_stock_playbook(doc.playbook);
    if ( newName ) {
        doc.playbook = newName;
    }
});

let collectionName = "FamilyPlaybooks";
const FPlaybook = mongoose.model('FPlaybookSchema', FPlaybookSchema, collectionName);
module.exports = FPlaybook;

