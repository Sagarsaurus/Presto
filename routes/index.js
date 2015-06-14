var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Presto' });
});

/* GET user page. */
router.get('/user', function(req, res, next) {
  res.render('user', { title: 'Presto' });
});

/* GET business page */

module.exports = router;
