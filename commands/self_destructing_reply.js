class Boom {

    static async self_destruct(message, reply, duration=5000) {
        return await message.reply(reply).then(msg => {
            msg.delete(duration)
        }).catch(err => {
            console.error(`unable to self destruct message due to ${err}`);
        });
    }
}

module.exports = Boom;

