const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const EntrySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    biCode: {
        type: String,
        required: true,
        unique: 'bi-used',
    },
    picture: {
        type: String,
        default: null,
    },
    pictureDescription: {
        type: String,
        default: null,
    },
    video: {
        type: String,
        default: null,
    },
    videoDescription: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['UNAUTHORIZED', 'AUTHORIZED', 'WINNER'],
        default: 'UNAUTHORIZED',
        index: true,
    },
}, { timestamps: true });

EntrySchema.plugin(uniqueValidator);

module.exports = model('Entry', EntrySchema);