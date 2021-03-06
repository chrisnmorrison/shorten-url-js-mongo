const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CryptoUrlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true
    }
});

const ShortUrl = mongoose.model('cryptoid', CryptoUrlSchema)

module.exports = ShortUrl