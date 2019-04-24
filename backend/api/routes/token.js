const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router.get('/:id', controllers.token.get);
router.post('/', controllers.token.create);
router.put('/:id', controllers.token.update);


module.exports = router