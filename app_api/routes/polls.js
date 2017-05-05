var express = require('express');
var router = express.Router();
var ctrlPolls = require('../controllers/polls.js');

// polls
router.get('/polls', ctrlPolls.pollList);
router.post('/polls', ctrlPolls.pollCreate);
router.get('/polls/:pollid', ctrlPolls.pollReadOne);
router.put('/polls/:pollid', ctrlPolls.pollUpdateValues)
router.delete('/polls/:pollid', ctrlPolls.pollDeleteOne);

module.exports = router;
