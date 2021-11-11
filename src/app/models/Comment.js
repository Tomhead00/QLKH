const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Comment = new Schema(
    {
        content: { type: String, default: '' },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        videoID: {
            type: mongoose.Schema.Types.String,
            ref: 'Video',
        },
    },
    {
        timestamps: true,
    },
);

// add plugin
module.exports = mongoose.model('Comment', Comment);
