var express = require('express');
var router = express.Router();
var fs = require('fs');
var filesModel = require('../models/upload/filesModel');

router.post('/parser', function (req, res) {

    console.log('req.files: ',JSON.parse(req.body).name);

    var validateNumber = function(phoneNumber){
        //var re1 = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        //var re2 = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        //var re3 = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
        //return (re2.match(phoneNumber) || re3.match(phoneNumber));
        var re = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
        return phoneNumber.match(re)[0];
    };

    var validateEmail = function(email){
        console.log(email);
        //var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/gi;
        var re = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        return email.match(re);
    };

    JSON.parse(req.body).name.forEach(function (f) {

        var filename = f;
        var file = filename.slice(0, filename.length - 3) + 'txt';


        fs.exists('/Users/juigodbole/WebstormProjects/ResumeParser/text/' + file, function (exists) {
            console.log('exists: ', exists);
        });

        fs.readFile('/Users/juigodbole/WebstormProjects/ResumeParser/text/' + file, 'utf8', function (err, data) {
            if (err) throw err;
            console.log('OK: ' + filename);
            var d = [];
            for (var i = 0; i < 100; i++) {
                d.push(data[i]);
            }
            var resumeData = d.join('');
            console.log(validateEmail(resumeData));
            console.log(validateNumber(resumeData));
            var email = validateEmail(resumeData);
            var phone = validateNumber(resumeData);

            new filesModel({filename: file,email: email,phone: phone}).save(function(err, results) {
                if (err) console.log(err);
                else {
                    console.log(results);
                }
             });

        });
    });

    res.status(200).json({message: 'ok'});
});

module.exports = router;
