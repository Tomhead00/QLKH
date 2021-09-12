const Course = require('../models/Course');
const { User } = require('../models/User');
const { multipleMongooseToObject } = require('../../util/mongoose');

class ManagerController {
    // GET /account
    async account(req, res, next) {
        let accountAdmin = await User.find({ role: 'admin' });
        let accountUser = await User.find({ role: 'user' });
        res.render('manager/account', {
            accountAdmin: multipleMongooseToObject(accountAdmin),
            accountUser: multipleMongooseToObject(accountUser),
            username: req.session.passport,
        });
    }
}

module.exports = new ManagerController();
