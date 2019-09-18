class FamilyPlaybookView {
    constructor( fpmodel ) {
        this.fplaybook = fpmodel;
    }

    async visit( richEmbed, summary_only=true ) {
        if (summary_only) {
            richEmbed
                .addField('Name', this.fplaybook.name, true)
                .addField('Playbook', this.fplaybook.playbook, true)
                .addField('Player', this.fplaybook.managed_by_username, true)
                .addBlankField()
        }
    }
}

module.exports = FamilyPlaybookView;