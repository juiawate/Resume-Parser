var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Files = new Schema({
    filename: String,
    email: String,
    phone: Number
});

module.exports = mongoose.model('Files', Files);