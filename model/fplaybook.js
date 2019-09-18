const mongoose = require('mongoose');
const FamilyPlaybook = require('../family_playbook');
const PlaybookSchema = require('./playbook');
const extendSchema = require('./extend_schema');

const FPlaybookSchema = extendSchema(PlaybookSchema, {});

FPlaybookSchema.pre('save', function(next) {

    let newName = FamilyPlaybook.find_stock_playbook(this.playbook);
    if ( newName ) {
        this.playbook = newName;
    }

    // everything is done, so let's call the next callback.
    next();

});

let collectionName = "FamilyPlaybooks";
const FPlaybook = mongoose.model('FPlaybookSchema', FPlaybookSchema, collectionName);
module.exports = FPlaybook;

