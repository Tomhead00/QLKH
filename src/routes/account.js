const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.get('/:slug', accountController.show);
router.get('/', accountController.index);
router.post('/check_username', accountController.check_username);
router.post('/check_email', accountController.check_email);
router.post('/login', accountController.login);
router.post('/create', accountController.create);

module.exports = router;
