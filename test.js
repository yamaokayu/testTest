'use strict';

function addOk() {
    var p = document.createElement('p');
    p.id = 'result';
    p.class = 'result';
    p.innerText = 'OK';
    window.document.body.appendChild(p);
}

setTimeout(addOk, 1000);
