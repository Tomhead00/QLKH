const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.get('/edit/:id/', accountController.edit);
router.put('/edit/:id/', accountController.update);
router.put('/edit/password/:id/', accountController.pwd);

router.post('/passwordReset', accountController.passwordReset);
router.get('/password-reset/:userId/:token/', accountController.formReset);
router.post(
    '/password-reset/:userId/:token',
    accountController.passwordResetID,
);

router.post('/check_email', accountController.check_email);
router.post('/logout', accountController.logout);
router.post('/create', accountController.create);

router.get('/:slug', accountController.show);
router.get('/', accountController.show);

module.exports = router;
