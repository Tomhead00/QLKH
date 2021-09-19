const Course = require('../models/Course');
const Video = require('../models/Video');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

var username = null;
var image = null;

class MeController {
    // GET /me/stored/Courses
    storeCourses(req, res, next) {
        let courseQuery = Course.find({});

        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([courseQuery, Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) =>
                res.render('me/stored-courses', {
                    username: req.session.passport,
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }
    // GET /me/trash/Courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then((courses) =>
                res.render('me/trash-courses', {
                    username: req.session.passport,
                    courses: multipleMongooseToObject(courses),
                }),
            )
            .catch(next);
    }

    // GET /me/stored/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('me/edit', {
                    course: mongooseToObject(course),
                }),
            )
            .catch(next);
    }
    // GET /me/stored/:id/edit/video
    editVideo(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render('me/editVideo', {
                    course: mongooseToObject(course),
                }),
            )
            .catch(next);
    }

    // PUT /me/stored/:id
    storeVideo(req, res, next) {
        // res.json(req.body)
        req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
        const video = new Video(req.body);
        video
            .save()
            .then(() => res.redirect('/me/stored/' + req.params.id + '/edit'))
            .catch(next);
    }
}

module.exports = new MeController();
