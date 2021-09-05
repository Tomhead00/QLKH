const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');
var username = null;
var image = null;

class SitesController {
    // GET /home
    home(req, res, next) {
        try {
            username = req.session.passport.user.username;
            image = req.session.passport.user.image;
        } catch {
            username = null;
            image = null;
        }
        res.render('home', {
            layout: false,
            username: username,
            image: image,
        });
    }

    failed(req, res) {
        res.send('you are a none valid user');
    }

    profile(req, res) {
        res.send('you are a valid user');
    }
}

module.exports = new SitesController();
