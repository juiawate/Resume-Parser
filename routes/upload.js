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


router.use(multer({
    dest: './uploads/'
}));


router.get('/', function (req, res) {
    res.render('upload');
});

router.post('/', function (req, res) {
    //console.log(req.files);
    //console.log(JSON.parse(req.body.myFile));

    for(var file in req.files) {
        console.log('file: ', req.files[file]);
        var spawn = require('child_process').spawn;
        var filepath = '/Users/juigodbole/WebstormProjects/ResumeParser/'+req.files[file].path;
        var newfilepath = '/Users/juigodbole/WebstormProjects/ResumeParser/text/'+(req.files[file].name).slice(0,req.files[file].name.length-3)+'txt';
        //console.log(file.name);
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

        });
    }

    var names = [];
    for(var f in req.files){
        names.push(req.files[f].name);
    }

    res.status(200).json({name: names});

});


module.exports = router;