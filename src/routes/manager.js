const express = require('express');
const router = express.Router();
const managerController = require('../app/controllers/ManagerController');

router.get('/account', managerController.account);

// block user
router.delete('/:id', managerController.block);
router.get('/blocked', managerController.blocked);

// restore user
router.patch('/:id', managerController.restore);

// force user
router.delete('/:id/force', managerController.delete);

// role
router.patch('/:id/down', managerController.down);
router.patch('/:id/up', managerController.up);

module.exports = router;
