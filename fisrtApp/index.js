const express = require('express');
const bodyParser = require('body-parser');
const generateAuthToken = require('./generateAuthToken');
const _ = require('lodash');
const amqp = require('amqplib');

const app = express();

const tokens = [];

app.use(bodyParser.json());

app.get('/auth', async (req, res) => {

    try {
        const token = generateAuthToken();
        tokens.push(token);
        console.log(tokens);
        res.header('x-auth', token).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post('/push', (req, res) => {
    const token = req.header('x-auth');

    if (tokens.indexOf(token) === -1) {
        return res.status(401).send();
    }
    const body = _.pick(req.body, ['tweet']);
    amqp.connect('amqp://cat:letmesing@phi.amazingcat.net:22002').then(function (conn) {
        return conn.createChannel().then(function (ch) {
            const q = 'hello';
            const msg = body.tweet;

            const ok = ch.assertQueue(q, { durable: false });

            return ok.then(function (_qok) {
                ch.sendToQueue(q, Buffer.from(msg));
                console.log(`Sent ${msg}`);
                return ch.close();
            });
        }).finally(function () { conn.close(); });
    }).catch(console.warn);

    res.send(body);
});

app.listen(8080, () => {
    console.log(`on port 8080`);
});