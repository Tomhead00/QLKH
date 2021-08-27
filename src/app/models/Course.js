const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Course = new Schema(
    {
        _id: { type: Number },
        name: { type: String, default: '' },
        mieuta: { type: String, default: '' },
        image: { type: String, default: '' },
        slug: { type: String, slug: 'name', unique: true },
        videoID: { type: String, default: '' },
    },
    {
        _id: false,
        timestamps: true,
    },
);

// add plugin
mongoose.plugin(slug);
Course.plugin(AutoIncrement, { inc_field: '_id' });
Course.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Course', Course);
