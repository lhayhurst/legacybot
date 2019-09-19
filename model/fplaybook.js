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
    traditions: [String],
    assets: [String],
    moves:  [String],
    role_move: {
        type: String,
        default: null
    },
    needs:  [String],
    surpluses: [String],
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
    mood_override: {
        type: Number,
        default: 0
    },
    treaties: {
        type: Map,
        of: Number,
        default: {}
    }
};

const FPlaybookSchema = extendSchema(PlaybookSchema, FamilySchema);

FPlaybookSchema.virtual('mood').get( function () {
    let ret = 0;
    if ( this.mood_override ) {
        return this.mood_override;
    }
    if ( this.surpluses ) {
        ret += this.surpluses.length;
    }
    if ( this.needs ) {
        ret -= this.needs.length;
    }
    return ret;
});


FPlaybookSchema.method( 'hasTreatyWith', function(targetFamily) {
    if (targetFamily == null) {
        return false;
    }
    let treaties = this.findTreatyWith(targetFamily);

    if (!treaties) {
        return false;
    }

    if (treaties > 0) {
        return true;
    }
    return false;
});


FPlaybookSchema.method( 'findTreatyWith', function(targetFamily) {
    this.initTreatyFor(targetFamily);
    targetFamily.initTreatyFor(this);
    if( ! this.treaties.get(targetFamily.playbook) ) {
        return 0;
    }
    else {
        return this.treaties.get(targetFamily.playbook);
    }
});


FPlaybookSchema.method( 'initTreatyFor', function(targetFamily) {
    if( ! this.treaties ) {
        this.treaties = {};
    }

    if ( ! this.treaties.get(targetFamily.playbook) ) {
        this.treaties.set( targetFamily.playbook,  0);
    }
    return this.treaties.get( targetFamily.playbook);

});

FPlaybookSchema.method( 'receiveTreatyFrom', function(targetFamily, bonus=1) {
    this.initTreatyFor(targetFamily);
    let eb = this.treaties.get(targetFamily.playbook);
    this.treaties.set(targetFamily.playbook, eb + bonus);
});

FPlaybookSchema.method( 'giveTreatyTo', function(targetFamily, bonus=1) {
    targetFamily.initTreatyFor(this);
    let eb = targetFamily.treaties.get(this.playbook);
    targetFamily.treaties.set(this.playbook, eb + bonus);
});

FPlaybookSchema.method( 'hasEnoughTreaty', function(targetFamily, bonus) {
    this.initTreatyFor(targetFamily);
    if ( this.treaties.get(targetFamily.playbook) < bonus)  {
        return false;
    }
    return true;
});

FPlaybookSchema.method( 'spendTreatyWith', function(targetFamily, bonus=1) {
    if (this.hasTreatyWith(targetFamily) && this.hasEnoughTreaty(targetFamily, bonus)) {
        let eb = this.treaties.get(targetFamily.playbook);
        this.treaties.set(targetFamily.playbook, eb - bonus);
    }
});

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
