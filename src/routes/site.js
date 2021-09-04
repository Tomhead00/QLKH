const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const app = express();

router.get('/', siteController.home);
router.get('/failed', siteController.failed);
router.get('/profile', siteController.profile);

module.exports = router;
