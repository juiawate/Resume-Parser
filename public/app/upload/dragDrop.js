
document.addEventListener('DOMContentLoaded', function () {

// Setup the dnd listeners.
    var dropZone = document.getElementById('drop');

    dropZone.addEventListener('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, false);

    dropZone.addEventListener('drop', function (event) {
        event.stopPropagation();
        event.preventDefault();

        var files = Array.prototype.slice.call(event.dataTransfer.files);
        var formdata = new FormData();

        var myFile = {
            filename: 'Files'
        };
        formdata.append('myFile', JSON.stringify(myFile));
        files.forEach(function (file, index){
            console.log(file, index);
            formdata.append('file' + index, file);
        });


        Promise.all([createPromise('/','post',formdata)]).then(function (data) {
            console.log('promise resolved data: ',data);
            //, createPromise('/upload','post',formdata)

            //console.log(JSON.stringify(data));
            var xhr = new XMLHttpRequest();
            xhr.open('post','/parser');
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(data));

        }, function () {
            console.log('error while uploading resume!');
        });

        /*var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li>', f.name,'</li>');
        }
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        */
    }, false);

    function createPromise(url, httpVerb, obj){
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(httpVerb,url);
            xhr.addEventListener('readystatechange', function () {
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        resolve(xhr.responseText);
                    }else{
                        reject();
                    }
                }
            });
            xhr.send(obj);
        });
    }
});
