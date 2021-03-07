const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EncryptUrlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true
    }
});

const ShortUrl = mongoose.model('crypto-id', EncryptUrlSchema)

module.exports = ShortUrl