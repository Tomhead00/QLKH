const express = require('express');
const router = express.Router();
const managerController = require('../app/controllers/ManagerController');

router.get('/account', managerController.account);
// account
// block account
router.delete('/:id', managerController.block);
router.get('/blocked', managerController.blocked);

// restore account
router.patch('/:id', managerController.restore);

// force account
router.delete('/:id/force', managerController.delete);

// role
router.patch('/:id/down', managerController.down);
router.patch('/:id/up', managerController.up);

// ------------- courses ---------------------
router.get('/courses', managerController.courses);

module.exports = router;
