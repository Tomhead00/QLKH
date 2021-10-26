const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Comment = new Schema(
    {
        content: { type: String, default: '' },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        course: {
            type: mongoose.Schema.Types.Number,
            ref: 'Course',
        },
    },
    {
        timestamps: true,
    },
);

// add plugin
module.exports = mongoose.model('Comment', Comment);
