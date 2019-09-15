class CommandsMetadata {

    static getCommands() {
        return {
            'help': {
                id: 'help',
                note: 'Gives some help about how to use LegacyBot'
            },
            'drop_family': {
                id: 'drop-family',
                note: 'Allows you to drop a family (if you have set one)'
            }
        }
    }
}


module.exports = CommandsMetadata;