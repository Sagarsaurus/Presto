var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Presto' });
});

/* GET business page. */
router.get('/business', function(req, res, next) {
  res.render('business', { title: 'Presto' });
});

module.exports = router;
