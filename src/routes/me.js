const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/MeController');

router.get('/stored/courses', meController.storeCourses);
router.get('/trash/courses', meController.trashCourses);
//edit video
router.get('/stored/:id/edit', meController.edit);
router.put('/stored/:id', meController.storeVideo);
router.get('/stored/:id/edit/addvideo', meController.addVideo);
router.post('/stored/:id/edit/:_id/:action', meController.actionVideo);
// update video
router.get('/stored/:id/edit/:_id/update', meController.updateVideo);
router.put('/stored/:id/edit/:_id/update', meController.putUpdateVideo);
// trash video
router.get('/trash/:id', meController.showTrashVideo);
router.patch('/trash/:_id/restore/:id', meController.restoreVideo);
router.delete('/trash/:_id/delete/:id/force', meController.forceDeleteVideo);
router.post(
    '/trash/:_id/handle-form-actions-trash',
    meController.handleFormTrashVideoActions,
);

module.exports = router;
