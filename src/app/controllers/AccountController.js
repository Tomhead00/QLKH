const bCrypt = require('bcrypt');
const { User } = require('../models/User');
const Token = require('../models/Token');
const Joi = require('joi');
const { multipleMongooseToObject } = require('../../util/mongoose');
const sendEmail = require('../../util/sendEmail');
const crypto = require('crypto');

// Khai báo vài thứ
var username = null;
var image = null;

class AccountController {
    // GET /Account/:slug and /Account/
    show(req, res) {
        try {
            username = req.session.passport.user.username;
            image = req.session.passport.user.image;
        } catch {
            username = null;
            image = null;
        }
        res.render('./user/account', {
            username: username,
            image: image,
        });
    }

    // POST /Account/check_email
    check_email(req, res, next) {
        if (!req.body.email) {
            res.redirect('/account');
        } else {
            // console.log(req.body.email);
            User.countDocuments(
                { email: req.body.email },
                function (err, result) {
                    res.send(result.toString());
                    // console.log(result.toString())
                },
            );
        }
    }
    // POST /Account/logout
    logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect('/');
        });
    }

    // POST /Account/create
    create(req, res, next) {
        // res.json(req.body);
        if (
            req.body.email &&
            req.body.username &&
            req.body.password &&
            req.body.passwordConfirmation
        ) {
            const user = new User(req.body);
            // console.log(user.password);
            user.image = '/img/user/default.png';
            user.password = bCrypt.hashSync(
                user.password,
                bCrypt.genSaltSync(10),
                null,
            );
            user.save()
                .then(() => res.redirect('back'))
                .catch(next);
        }
    }

    // POST /Account/logout
    async passwordReset(req, res, next) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
            });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const user = await User.findOne({ email: req.body.email });
            if (!user)
                return res
                    .status(400)
                    .send("user with given email doesn't exist");

            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex'),
                }).save();
            }
            const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
            await sendEmail(user.email, 'Password reset', link);

            res.send('password reset link sent to your email account');
        } catch (error) {
            res.send('An error occured');
            console.log(error);
        }
    }

    // POST /Account/logout
    async passwordResetID(req, res, next) {
        try {
            const schema = Joi.object({ password: Joi.string().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const user = await User.findById(req.params.userId);
            if (!user) return res.status(400).send('invalid link or expired');

            const token = await Token.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token) return res.status(400).send('Invalid link or expired');

            user.password = req.body.password;
            await user.save();
            await token.delete();

            res.send('password reset sucessfully.');
        } catch (error) {
            res.send('An error occured');
            console.log(error);
        }
    }
}

module.exports = new AccountController();
