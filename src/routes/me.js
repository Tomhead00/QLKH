const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/MeController');

router.get('/stored/courses', meController.storeCourses);
router.get('/trash/courses', meController.trashCourses);
router.get('/stored/:id/edit', meController.edit);
router.get('/stored/:id/edit/video', meController.editVideo);
router.put('/stored/:id', meController.storeVideo);

module.exports = router;
