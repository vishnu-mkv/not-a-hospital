const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('UserAdmin', adminSchema);
module.exports = Admin;