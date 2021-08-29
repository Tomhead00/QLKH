const bCrypt = require('bcrypt');
const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');

class AccountController {
    // GET Account
    index(req, res) {
        res.render('./user/account');
    }

    // GET /Account/:slug
    show(req, res) {
        res.render('./user/account');
    }

    // POST /Account/check_username
    check_username(req, res, next) {
        // console.log(req.body.username);
        User.countDocuments(
            { username: req.body.username },
            function (err, result) {
                res.send(result.toString());
                // console.log(result.toString())
            },
        );
    }

    // POST /Account/check_email
    check_email(req, res, next) {
        // console.log(req.body.email);
        User.countDocuments({ email: req.body.email }, function (err, result) {
            res.send(result.toString());
            // console.log(result.toString())
        });
    }

    // POST /Account/login
    login(req, res) {
        // console.log(req.body.email);
        User.findOne({ email: req.body.email }, function (err, result) {
            try {
                var checkpass = bCrypt.compareSync(
                    req.body.password,
                    result.password,
                );
                // console.log(checkpass);
                if (checkpass) {
                    res.send('Đăng nhập thành công!');
                } else {
                    res.send('Mật khẩu không chính xác!');
                }
            } catch (err) {
                res.send(
                    'Tài khoản không tồn tại hoặc hệ thống gặp sự cố! Vui lòng thử lại!',
                );
            }
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
            console.log(user.password);
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
}

module.exports = new AccountController();
