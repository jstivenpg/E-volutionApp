const mongoose = require('mongoose');
const { Schema } = mongoose;
const dateFormat = require('dateformat');
const moment = require('moment');
const { locale } = require('moment');

const TaskSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    date: { type: String, default: moment().format('YYYY-MM-DD')},
    priority: { type: String, require: true },
    fecha_vencimiento: { type: String, require: true},
    user: { type: String}
});

module.exports = mongoose.model('Task', TaskSchema)