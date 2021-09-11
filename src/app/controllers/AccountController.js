const bCrypt = require('bcrypt');
const { User } = require('../models/User');
const Token = require('../models/Token');
const Joi = require('joi');
const sendEmail = require('../../util/sendEmail');
const crypto = require('crypto');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');

// Khai báo vài thứ

class AccountController {
    // GET /Account/:slug and /Account/
    show(req, res) {
        res.render('./user/account', {
            username: req.session.passport,
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

    // POST passwordReset
    async passwordReset(req, res, next) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
            });
            const { error } = schema.validate(req.body);
            if (error)
                return res.status(400).render('./user/account', {
                    alert1: error.details[0].message,
                });

            const user = await User.findOne({ email: req.body.email });
            if (!user)
                return res.status(400).render('./user/account', {
                    alert1: 'Tài khoản chưa đăng ký trong hệ thống!',
                });

            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex'),
                }).save();
            }
            const link = `${process.env.BASE_URL}/account/password-reset/${user._id}/${token.token}/`;
            await sendEmail(user.email, 'Password reset', link);

            // res.send('password reset link sent to your email account');
            res.render('./user/account', {
                alert1: 'Liên kết đã được gửi trong email, vui lòng kiểm tra và đổi mật khẩu!',
            });
        } catch (error) {
            res.render('./user/account', {
                alert1: 'Một lỗi đã xảy ra, Vui lòng thử lại!',
            });
            console.log(error);
        }
    }

    // GET form reset password
    async formReset(req, res, next) {
        res.render('./user/resetPass', {
            layout: false,
        });
    }

    // POST passwordResetID
    async passwordResetID(req, res, next) {
        try {
            const schema = Joi.object({ password: Joi.string().required() });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const user = await User.findById(req.params.userId);
            if (!user)
                return res.status(400).render('./user/account', {
                    alert1: 'Liên kết không hợp lệ hoặc đã hết hạn, Vui lòng thử lại!',
                });

            const token = await Token.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token)
                return res.status(400).render('./user/account', {
                    alert1: 'Liên kết không hợp lệ hoặc đã hết hạn, Vui lòng thử lại!',
                });

            user.password = req.body.password;
            user.password = bCrypt.hashSync(
                user.password,
                bCrypt.genSaltSync(10),
                null,
            );
            await user.save();
            await token.delete();

            // res.send('password reset sucessfully.');
            res.render('./user/account', {
                alert1: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại!',
            });
        } catch (error) {
            res.render('./user/account', {
                alert1: 'Một lỗi đã xảy ra, Vui lòng thử lại!',
            });
            console.log(error);
        }
    }
    // Update user
    // GET /account/edit/:id
    edit(req, res, next) {
        User.findById(req.params.id)
            .then((user) =>
                res.render('user/edit', {
                    user: mongooseToObject(user),
                    username: req.session.passport,
                }),
            )
            .catch(next);
    }
}

module.exports = new AccountController();
