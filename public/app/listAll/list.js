
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('button');
    btn.addEventListener('click', function () {
        var list = document.getElementById('list');
        list.innerHTML = '';

        makeAjaxCall('/list','get',null, function (results) {
            console.log(JSON.parse(results.responseText));
            var ul = createElement('ul',list);
            Array.prototype.forEach.call(JSON.parse(results.responseText), function(r) {
                var li = createElement('li',ul,'', r.email+' : '+ r.phone);
            });
        });
    });


    function createElement(elementType, parent, className, innerHTML, custom) {
        var element = document.createElement(elementType);
        if (parent) parent.appendChild(element);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        if (typeof custom !== 'undefined') {
            for (var prop in custom) {
                element.setAttribute(prop, custom[prop]);
            }
        }
        return element;
    }

    function makeAjaxCall(url, httpVerb, obj, callback){
        var xhr = new XMLHttpRequest();
        xhr.open(httpVerb,url);
        if(httpVerb === 'POST' || httpVerb === 'PUT') xhr.setRequestHeader('content-type', 'application/json');

        xhr.addEventListener('readystatechange', function () {
            if(xhr.readyState === 4) {
                callback(xhr);
            }
        });
        if(httpVerb === 'POST' || httpVerb === 'PUT') xhr.send(JSON.stringify(obj));
        else xhr.send();
    }
});