class Boom {


    static async self_destruct(message, reply) {
        if ( Boom.keepDuration == null ) {
            Boom.keepDuration = 30000; //7 second default
        }
        if ( Boom.keepDuration < 0 ) { //keep forever
            return await message.reply(reply);
        }
        else {
            return await message.reply(reply).then(msg => {
                msg.delete(Boom.keepDuration);
                message.delete(Boom.keepDuration);
            }).catch(err => {
                console.error(`unable to self destruct message due to ${err}`);
            });
        }
    }

    static keep( keepArg ) {
        if( keepArg === 'forever') { //special case
            Boom.keepDuration = -1;
        }
        else {
            Boom.keepDuration = parseInt( keepArg, 10) * 1000; //it comes in in seconds
        }
    }


}

module.exports = Boom;

