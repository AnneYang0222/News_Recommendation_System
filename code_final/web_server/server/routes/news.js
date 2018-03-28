var express = require('express');
var rpc_client = require('../rpc_client/rpc_client');
var router = express.Router();

 /* GET news list. */

// "localhost:3000/news/userId/1@1.com/pageNum/2"
router.get('/userId/:userId/pageNum/:pageNum', function(req, res, next) {
  console.log('Fetching news...');
  user_id = req.params['userId'];
  page_num = req.params['pageNum'];

  rpc_client.getNewsSummariesForUser(user_id, page_num, function(response) {
    res.json(response);
  });
});

router.post('/userId/:userId/newsId/:newsId', function(req, res, next) {
  console.log('logging news click...');
  user_id = req.params['userId'];
  page_num = req.params['newsId'];

  rpc_client.logNewsClickForUser(user_id, newsId);
  res.status(200);
});

module.exports = router;
