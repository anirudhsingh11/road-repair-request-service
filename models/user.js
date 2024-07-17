var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    mobile: {type: String, required: true},
    password: {type: String, required: true},
    user_type: {type: String, required: true, enum: ['user', 'engineer', 'contractor', 'admin'], default: 'user'}
});

module.exports = mongoose.model("User", UserSchema);