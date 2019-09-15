class CommandsMetadata {

    static getCommands() {
        return {
            'help': {
                id: 'help',
                note: 'Gives some help about how to use LegacyBot'
            },
            'drop_family': {
                id: 'drop-family',
                note: 'Allows you to drop a Family (if you have set one)'
            },
            'new_family': {
                id: 'new-family',
                note: 'Create a new Family (Legacy Core Rulebook Second Edition pg 23)'
            },
            'family': {
                id: 'family',
                note: 'Get information about your family, or all the families in your guild.'
            },
            'need': {
                id: 'need',
                note: 'Set the resources that your Family Needs.'
            }
        }
    }
}


module.exports = CommandsMetadata;