/*(function() {
    var childProcess = require("child_process");
    oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();*/

var router = require('express').Router();
var multer = require('multer');
var fs = require('fs');
var filesModel = require('../models/upload/filesModel');

router.use(multer({
    dest: './uploads/'
}));


router.get('/', function (req, res) {
    res.render('upload');
});

router.post('/', function (req, res) {
    //console.log(req.files);
    //console.log(JSON.parse(req.body.myFile));

    var spawn = require('child_process').spawn;
    var filepath = '/Users/juigodbole/WebstormProjects/ResumeParser/'+req.files.file0.path;
    var newfilepath = '/Users/juigodbole/WebstormProjects/ResumeParser/text/'+(req.files.file0.name).slice(0,req.files.file0.name.length-3)+'txt';
    console.log(req.files.file0.name);
    var child = spawn('./pdftotext', [filepath,newfilepath],{cwd: '/Users/juigodbole/Documents/xpdf/'});

    //console.log(child);
    child.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    child.stdin.on('read', function (data) {
        console.log('stdin: ' + data);
    });

    child.on('close', function (code) {
        console.log('child process exited with code ' + code);

        res.status(200).json({name: req.files.file0.name});
    });


});

router.post('/upload', function (req, res) {

    console.log('req.files: ',JSON.parse(req.body).name);
    var filename = JSON.parse(req.body).name; //(req.files.file0.name);
    var file = filename.slice(0,filename.length-3)+'txt';

    var validateNumber = function(phoneNumber){
        //var re1 = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        var re2 = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        var re3 = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
        return (re2.match(phoneNumber) || re3.match(phoneNumber));
    };

    var validateEmail = function(email){
        console.log(email);
        //var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/gi;
        var re = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        return email.match(re);
    };

    fs.exists('/Users/juigodbole/WebstormProjects/ResumeParser/text/'+file, function (exists) {
        console.log('exists: ',exists);
    });

    fs.readFile('/Users/juigodbole/WebstormProjects/ResumeParser/text/'+file, 'utf8' ,function(err, data) {
        if (err) throw err;
        console.log('OK: ' + filename);
        var d = [];
        for(var i = 0; i < 100;i++) {
            d.push(data[i]);
        }
        var resumeData = d.join('');
        console.log(validateEmail(resumeData));
        var email = validateEmail(resumeData);
        //console.log(validateNumber(resumeData));
        var phone = 0; //validateNumber(resumeData);

        new filesModel({filename: file,email: email,phone: phone}).save(function(err, results) {
            if (err) res.status(500).json(err);
            else {
                res.status(200).json(results);
                console.log(results);
            }
        });

    });

    res.status(200).json({message: 'ok'});
});



module.exports = router;