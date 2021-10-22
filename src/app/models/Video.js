const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Video = new Schema(
    {
        _id: { type: Number },
        name: { type: String, default: '' },
        mieuta: { type: String, default: '' },
        image: { type: String, default: '' },
        slug: { type: String, slug: 'name', unique: true },
        videoID: { type: String, default: '' },
        unlock: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        _id: false,
        timestamps: true,
    },
);

// add plugin
mongoose.plugin(slug);
Video.plugin(AutoIncrement, { id: '_id_video', inc_field: '_id' });
Video.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Video', Video);
