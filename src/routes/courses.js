const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');

router.get('/', courseController.course);
router.post('/store', courseController.store);
router.post('/handle-form-actions', courseController.handleFormActions);
router.post(
    '/handle-form-actions-trash',
    courseController.handleFormTrashActions,
);
router.post('/checkThamgia', courseController.checkThamgia);
router.post('/thamGia/:slug', courseController.thamGia);
router.put('/:id', courseController.update);
router.patch('/:id/restore', courseController.restore);
router.delete('/:id', courseController.delete);
router.delete('/:id/force', courseController.forceDelete);
router.get('/show/:slug', courseController.show);
// router.post('/getNumUser', courseController.getNumUser);

// AJAX show video
router.post('/checkUnlock', courseController.checkUnlock);
router.post('/unlockVideo', courseController.unlockVideo);

// AJAX Comment
router.post('/addComment', courseController.addComment);
router.post('/refreshComment', courseController.refreshComment);

// AJAX search
router.post('/search', courseController.search);
// courses option
router.get('/courseNew', courseController.courseNew);
router.get('/coursePopular', courseController.coursePopular);

module.exports = router;
