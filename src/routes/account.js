const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.post('/passwordReset', accountController.passwordReset);
router.post('/passwordReset:/userid/:token', accountController.passwordResetID);

router.post('/check_email', accountController.check_email);
router.post('/logout', accountController.logout);
router.post('/create', accountController.create);
router.get('/:slug', accountController.show);
router.get('/', accountController.show);

module.exports = router;
