const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    date: { type: Date, default: Date.now},
    priority: { type: String, require: true },
    fecha_vencimiento: { type: String, require: true},
    user: { type: String}
});

module.exports = mongoose.model('Task', TaskSchema)