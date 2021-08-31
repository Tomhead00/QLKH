module.exports = function CheckUser(req, res, next) {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/account');
    }
};
