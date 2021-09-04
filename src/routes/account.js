const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.post('/check_username', accountController.check_username);
router.post('/check_email', accountController.check_email);
router.post('/logout', accountController.logout);
router.post('/create', accountController.create);
router.get('/:slug', accountController.show);
router.get('/', accountController.show);

module.exports = router;
