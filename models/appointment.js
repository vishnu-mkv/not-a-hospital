const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;