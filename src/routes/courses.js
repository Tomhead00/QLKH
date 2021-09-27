const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');

router.get('/', courseController.course);
router.post('/store', courseController.store);
router.post('/handle-form-actions', courseController.handleFormActions);
router.post('/checkThamgia', courseController.checkThamgia);
router.post('/thamGia/:slug', courseController.thamGia);
router.put('/:id', courseController.update);
router.patch('/:id/restore', courseController.restore);
router.delete('/:id', courseController.delete);
router.delete('/:id/force', courseController.forceDelete);
router.get('/:slug', courseController.show);
router.post('/getNumUser', courseController.getNumUser);

module.exports = router;
