class FamilyPlaybook {

    static playbooks() {
        return {
            'The Cultivators of The New Flesh': {
                playbookName: 'The Cultivators of The New Flesh'
            }
        };
    }

    constructor(playbook) {
        this.family_playbook = playbook;
    }

    static fromNedbDocument(document) {
        let ret = new FamilyPlaybook(document.family_playbook);
        ret.name = document.family_name;
        ret.reach = document.family_reach;
        if( document.user_id ) {
            ret.user_id = document.user_id;
        }

        return ret;
    }

    get user() {
        return this.user_id;
    }

    set user(userid) {
        this.user_id = userid;
    }

    get playbook() {
        return this.family_playbook;
    }

    get name() {
        return this.family_name;
    }

    set name(nameStr) {
        this.family_name = nameStr;
    }

    set reach(reachValue) {
        this.family_reach = reachValue;
    }

    get reach() {
        return this.family_reach;
    }
}

module.exports = FamilyPlaybook;