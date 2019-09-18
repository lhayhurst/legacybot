const mongoose = require('mongoose');
const FamilyPlaybook = require('../family_playbook');
const PlaybookSchema = require('./playbook');
const extendSchema = require('./extend_schema');

const FamilySchema = {
    theme: {
        type: String,
        default: null
    },
    doctrine: {
        type: String,
        default: null
    },
    lifestyle: {
        type: String,
        default: null,
    },
    traditions: {
        type: [String],
        default: undefined,
    },
    assets: {
        type: [String],
        default: undefined,
    },
    moves: {
        type: [String],
        default: undefined
    },
    notes: {
        type: String,
        default: null
    },
    grasp: {
        type: Number,
        default: 0
    },
    reach: {
        type: Number,
        default: 0
    },
    sleight: {
        type: Number,
        default: 0
    },
    data_resource: {
        type: Number,
        default: 0
    },
    tech: {
        type: Number,
        default: 0
    },
    needs: {
        type: [String],
        default: undefined,
    },
    surpluses: {
        type: [String],
        default: undefined
    },
    treaties: {
        type: Map,
        of: String
    },
};

const FPlaybookSchema = extendSchema(PlaybookSchema, FamilySchema);

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

