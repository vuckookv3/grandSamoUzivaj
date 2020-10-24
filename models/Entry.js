const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const { s3Delete } = require('../helpers');

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
        enum: ['UNAUTHORIZED', 'DENIED', 'AUTHORIZED', 'WINNER'],
        default: 'UNAUTHORIZED',
        index: true,
    },
    winnerPhase: {
        type: Number,
        enum: [0, 1, 2, 3, 4],
        default: 0,
    },
    winnerPrize: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
        default: 0,
    },
}, { timestamps: true });

EntrySchema.plugin(uniqueValidator);

EntrySchema.pre('save', async function () {

});

EntrySchema.pre('remove', async function () {
    if (this.picture) {
        await s3Delete(this.picture);
    }

    if (this.video) {
        await s3Delete(this.video);
    }
});

module.exports = model('Entry', EntrySchema);