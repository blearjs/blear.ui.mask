/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Mask = require('../src/index');
var Window = require('blear.ui.window');

var mask = new Mask();
var win = new Window({
    width: 200
});

win.setHTML(document.getElementById('window'));

document.getElementById('open').onclick = function () {
    mask.open();
    win.open();
};

mask.on('hit', function () {
    mask.close();
    win.close();
});

