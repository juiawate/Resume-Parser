var express = require('express');
var router = express.Router();
var filesModel = require('../models/upload/filesModel');

router.get('/list', function(req, res, next) {
   filesModel.find({}, function (err, results) {
       if(err) res.status(500).json(err);
       else {
           res.status(200).json(results);
           console.log(results);
       }
   });
});

module.exports = router;
