const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Course = new Schema(
    {
        name: { type: String, default: '' },
        mieuta: { type: String, default: '' },
        image: { type: String, default: '' },
        slug: { type: String, slug: 'name', unique: true },
        videoID: { type: String, default: '' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Course', Course);
