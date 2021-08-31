const bCrypt = require('bcrypt');
const User = require('../models/User');
var alert;
var reemail;

class AccountController {
    // GET /Account/:slug and /Account/
    show(req, res) {
        res.render('./user/account', {
            alert: alert,
            email: reemail,
            username: req.session.username,
            image: req.session.image,
        });
    }

    // POST /Account/check_username
    check_username(req, res, next) {
        if (!req.body.username) {
            res.redirect('/account');
        } else {
            // console.log(req.body.username);
            User.countDocuments(
                { username: req.body.username },
                function (err, result) {
                    res.send(result.toString());
                    // console.log(result.toString())
                },
            );
        }
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

    // POST /Account/login
    async login(req, res) {
        if (req.body.email == 'null' && req.body.password == 'null') {
            res.redirect('/account');
        } else {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                alert = 'Tài khoản không tồn tại!';
                reemail = null;
                return res.redirect('back');
            }
            const isMatch = await bCrypt.compareSync(password, user.password);

            if (!isMatch) {
                alert = 'Sai mật khẩu!';
                reemail = user.email;
                return res.redirect('back');
            } else {
                reemail = null;
                alert = null;
                req.session.isAuth = true;
                req.session.username = user.username;
                req.session.image = user.image;
                res.redirect('/courses');
            }
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
}

module.exports = new AccountController();
