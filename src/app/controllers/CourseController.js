const Course = require('../models/Course');
const Video = require('../models/Video');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
const moment = require('moment');
const { array } = require('joi');
const { User } = require('../models/User');
const { countDocuments } = require('../models/Course');

class CourseController {
    // GET /course
    async course(req, res, next) {
        const user = await User.findById({
            _id: req.session.passport.user._id,
        });
        // console.log(typeof(user.khoahoc))
        // console.log(user.khoahoc)

        const courses = await Course.find({ _id: { $in: user.khoahoc } })
            .populate({ modal: 'user', path: 'actor' })
            .populate('video')
            .sort({ updatedAt: -1 })
            .catch(next);
        // console.log(courses);
        // var finalArray = courses.map(function (obj) {
        //     return obj._id;
        // });
        // console.log(finalArray);

        // const countDoc =  await User.countDocuments({khoahoc: {$in: finalArray}})
        // console.log(countDoc);

        const courses1 = await Course.find({})
            .populate({ modal: 'user', path: 'actor' })
            .populate('video')
            .sort({ updatedAt: -1 })
            .limit(4);

        // res.json(course);
        // res.json(courses1);
        res.render('courses/courses', {
            courses: multipleMongooseToObject(courses),
            courses1: multipleMongooseToObject(courses1),
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
        course.actor = req.session.passport.user._id;
        course
            .save()
            .then(
                () =>
                    User.findOneAndUpdate(
                        { _id: req.session.passport.user._id },
                        { $push: { khoahoc: course._id } },
                        { new: true, useFindAndModify: false },
                    ),
                res.redirect('/me/stored/courses'),
            )
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
            .then((course) => res.redirect('back'))
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
        User.findOneAndUpdate(
            { _id: req.session.passport.user._id },
            { $pull: { khoahoc: req.params.id } },
            { new: true, useFindAndModify: false },
        ).catch(next);

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

    // POST /courses/checkThamgia
    async checkThamgia(req, res, next) {
        // res.send("test");
        // console.log(req.body);
        // console.log(req.session.passport.user._id);
        // Course.countDocuments({thanhvien: req.session.passport.user._id, slug: req.body.slug}, function(err, count) {
        //     // console.log(count);
        //     var countString = count.toString();
        //     res.send(countString);
        // })
        await User.findById({ _id: req.session.passport.user._id })
            .populate({ modal: 'course', path: 'khoahoc' })
            .then((user) => {
                var check = 0;
                user.khoahoc.forEach(function (element, index) {
                    // Do your thing, then:
                    if (element.slug == req.body.slug) {
                        return (check = 1);
                    }
                });
                res.send(check.toString());
            })
            .catch(next);
    }

    // POST /courses/thamGia
    async thamGia(req, res, next) {
        // res.json(req.params.slug);
        // Course.findOneAndUpdate(
        //     {slug: req.params.slug},
        //     { $push: { thanhvien: req.session.passport.user._id }},
        //     { new: true, useFindAndModify: false }
        // )
        // .then (res.redirect("/courses/" + req.params.slug))
        // .catch(next);
        const course = await Course.find({ slug: req.params.slug });
        // console.log(course);
        // console.log(course[0]._id);
        User.findOneAndUpdate(
            { _id: req.session.passport.user._id },
            { $push: { khoahoc: course[0]._id } },
            { new: true, useFindAndModify: false },
        )
            .then(() => {
                res.redirect('/courses/' + req.params.slug);
            })
            .catch(next);
    }

    // POST /courses/getNumUser <AJAX>
    getNumUser(req, res, next) {
        // console.log(req.body);
        Course.findOne(req.body).then((course) => {
            // console.log(course._id)
            User.countDocuments({ khoahoc: course }).then((count) => {
                res.send(count.toString());
            });
        });
    }
}

module.exports = new CourseController();
