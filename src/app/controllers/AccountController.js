const bCrypt = require('bcrypt');
const { User } = require('../models/User');
const Token = require('../models/Token');
const Joi = require('joi');
const sendEmail = require('../../util/sendEmail');
const crypto = require('crypto');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
fs = require('fs');

class AccountController {
    // GET /Account/:slug and /Account/
    show(req, res) {
        res.render('./user/account', {
            title: 'Đăng nhập / Đăng ký',
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
            ).catch(next);
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
            user.image = '/img/user/default.jpg';
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
            title: 'Khôi phục mật khẩu',
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
                    title: 'Cập nhật thông tin tài khoản',
                    user: mongooseToObject(user),
                    username: req.session.passport,
                }),
            )
            .catch(next);
    }

    // PUT /account/edit/:id
    async update(req, res, next) {
        // console.log("aa");
        if (req.file) {
            req.body.image = '/img/user/' + req.file.filename;
            var path = './src/public' + req.session.passport.user.image;

            if (
                fs.existsSync(path) &&
                req.session.passport.user.image != '/img/user/default.jpg'
            )
                fs.unlinkSync('./src/public' + req.session.passport.user.image);
        }

        await User.updateOne({ _id: req.params.id }, req.body)
            .then(async () => {
                var user = await User.findById(req.params.id);
                // if (req.session.passport.user._id == user._id)
                //     req.session.passport.user = user;
                res.redirect(req.body.url);
            })
            .catch(next);
    }

    // PUT /account/edit/password/:id
    async pwd(req, res, next) {
        // res.json(req.body);
        // console.log(req.body);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.render('user/edit', {
                user: mongooseToObject(user),
                username: req.session.passport,
                alert: 'Tài khoản không tồn tại!',
            });
        }

        const check = bCrypt.compareSync(req.body.passOld, user.password);
        // console.log(check);
        if (!check) {
            return res.render('user/edit', {
                user: mongooseToObject(user),
                username: req.session.passport,
                alert: 'Sai mật khẩu! Vui lòng thử lại!',
            });
        }
        user.password = bCrypt.hashSync(
            req.body.passNew,
            bCrypt.genSaltSync(10),
            null,
        );
        user.save();
        // req.session.passport.user = user;
        res.redirect('/account/edit/' + user._id);
    }
}

module.exports = new AccountController();
