const express = require('express');
const router = express.Router();
const managerController = require('../app/controllers/ManagerController');

router.get('/account', managerController.account);

module.exports = router;
