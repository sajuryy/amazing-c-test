const amqp = require('amqplib');
require('./mongoose');
const { Message } = require('./Message');

amqp.connect('amqp://cat:letmesing@phi.amazingcat.net:22002').then(function (conn) {
    process.once('SIGINT', function () { conn.close(); });
    return conn.createChannel().then(function (ch) {

        let ok = ch.assertQueue('hello', { durable: false });

        ok = ok.then(function (_qok) {
            return ch.consume('hello', function (msg) {

                const obj = {
                    text: msg.content.toString()
                };
                const message = new Message(obj);
                message.save();
                console.log(`save to BD ${msg.content.toString()} `);
            }, { noAck: true });
        });

        return ok.then(function (_consumeOk) {
            console.log(' [*] Waiting for messages. To exit press CTRL+C');
        });
    });
}).catch(console.warn);
