const express = require('express');
const router = express.Router();
const controllers = require('../controllers');


router.get('/all', controllers.quote.getAll);
router.get('/all-plus-deleted', controllers.quote.getFullList);
router.post('/', controllers.quote.create);
router.delete('/:id', controllers.quote.deleteOne);
router.put('/:id', controllers.quote.update);
router.get('/random', controllers.quote.getRandom);
router.put('/delete/:id', controllers.quote.markQuoteAsDeleted);


module.exports = router