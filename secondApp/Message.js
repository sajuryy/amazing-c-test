const mongoose = require('mongoose');

const Message = mongoose.model('Message', {
    text: {
    }
});

module.exports = {Message};