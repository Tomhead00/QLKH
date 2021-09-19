const Course = require('../models/Course');
const Video = require('../models/Video');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
const moment = require('moment');
const { array } = require('joi');

class CourseController {
    // GET /course
    async course(req, res, next) {
        const courses = await Course.find({}).sort({ updatedAt: -1 }).limit(4);

        res.render('courses/courses', {
            courses: multipleMongooseToObject(courses),
            username: req.session.passport,
        });
    }

    // GET /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                res.render('courses/show', {
                    course: mongooseToObject(course),
                    username: req.session.passport,
                });
            })
            .catch(next);
        // res.send('Course Detail - ' + req.params.slug);
    }

    // POST /courses/store
    store(req, res, next) {
        // res.json(req.body)
        var array = [
            '?technology',
            '?nature',
            '?color',
            '?cpu',
            '?Coutryside',
            '?Fruit',
            '?Vegatables',
            '?people',
            '?ai',
            '?sunny',
        ];
        var randomElement = array[Math.floor(Math.random() * array.length)];
        req.body.image = `https://source.unsplash.com/random/306x230/${randomElement}`;
        const course = new Course(req.body);
        course
            .save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // PUT /courses/:id
    update(req, res, next) {
        // res.json(req.body)
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // DELETE /courses/:id
    delete(req, res, next) {
        // res.json(req.body)
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // DELETE /courses/:id/forceDelete
    forceDelete(req, res, next) {
        // res.json(req.body)
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // POST /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
    }
}

module.exports = new CourseController();
