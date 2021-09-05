const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Joi = require('joi');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            default: 'user',
        },
    },
    {
        timestamps: true,
    },
);
userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const User = mongoose.model('user', userSchema);
// module.exports = User;

const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { User, validate };
