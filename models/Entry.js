const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const path = require('path');
const pathToUploads = path.join(__dirname, '..', '/public/uploads');
const fs = require('fs');

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
    submitted: {
        type: Boolean,
        default: false,
        index: true,
    },
    status: {
        type: String,
        enum: ['UNAUTHORIZED', 'AUTHORIZED', 'WINNER'],
        default: 'UNAUTHORIZED',
        index: true,
    },
}, { timestamps: true });

EntrySchema.plugin(uniqueValidator);

EntrySchema.pre('save', async function () {

});

EntrySchema.pre('remove', function () {
    if (this.picture) {
        fs.unlinkSync(path.join(pathToUploads, this.picture));
    }

    if (this.video) {
        fs.unlinkSync(path.join(pathToUploads, this.video));
    }
});

module.exports = model('Entry', EntrySchema);