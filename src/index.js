/**
 * 遮罩层
 * @author ydr.me
 * @create 2016-04-20 16:56
 */



'use strict';

var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');
var fun = require('blear.utils.function');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var layout = require('blear.core.layout');
var event = require('blear.core.event');
var Window = require('blear.ui.window');
var UI = require('blear.ui');
var template = require('./template.html', 'html');


var UIIndex = 0;
var UIClassName = UI.UI_CLASS + '-mask';
var freezeClassName = UIClassName + '-freeze';
var win = window;
var doc = win.document;
var htmlEl = doc.documentElement;
var bodyEl = doc.body;
var windowMaskList = [];
var windowMaskLength = 0;
var htmlElLatestMarginTop = 0;
var windowLatestScrollTop = 0;
var maskMap = {};
var defaults = {
    bgColor: 'black',
    opacity: 0.5,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    addClass: '',
    openAnimation: null,
    resizeAnimation: null,
    closeAnimation: null,
    animation: function (to, done) {
        attribute.style(this.getWindowEl(), to);
        done();
    }
};

var Mask = Window.extend({
    className: 'Mask',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign(true, {}, defaults, options);
        Mask.parent(the, options);
        the[_initNode]();
        the[_initEvent]();
    },

    // /**
    //  * 设置 HTML
    //  * @param html {String|Node}
    //  * @returns {HTMLElement}
    //  */
    // setHTML: function (html) {
    //     var the = this;
    //
    //     if (typeis.String(html)) {
    //         attribute.html(the[_maskEl], html);
    //     } else if (html && html.nodeType) {
    //         modification.empty(the[_maskEl]);
    //         modification.insert(html, the[_maskEl]);
    //     }
    //
    //     Mask.parent.update(the);
    //
    //     return selector.children(the[_maskEl])[0];
    // },

    /**
     * 销毁实例
     */
    destroy: function (callback) {
        var the = this;

        callback = fun.noop(callback);
        callback = fun.bind(callback, the);
        event.un(the.getWindowEl(), 'click');
        Mask.parent.destroy(the, callback);
    }
});
var pro = Mask.prototype;
var _maskEl = Mask.sole();
var _maskId = Mask.sole();
var _options = Mask.sole();
var _initNode = Mask.sole();
var _initEvent = Mask.sole();
var _freezeBackground = Mask.sole();
var _unfreezeBackground = Mask.sole();


/**
 * 初始化节点
 */
pro[_initNode] = function () {
    var the = this;
    var options = the[_options];

    // init node
    the[_maskEl] = Mask.parent.setHTML(the, template);
    the[_maskId] = UIIndex++;
    // maskMap[the[_maskId]] = the;
    attribute.style(the[_maskEl], {
        backgroundColor: options.bgColor,
        opacity: options.opacity
    });
};


/**
 * 初始化事件
 */
pro[_initEvent] = function () {
    var the = this;
    var options = the[_options];

    // init event
    the.on('beforeOpen', function (pos) {
        pos.top = options.top;
        pos.right = options.right;
        pos.bottom = options.bottom;
        pos.left = options.left;
        pos.width = 'auto';
        pos.height = 'auto';
        the[_freezeBackground]();
    });

    the.on('afterClose', function () {
        the[_unfreezeBackground]();
    });

    event.on(the.getWindowEl(), 'click', function () {
        the.emit('hit');
    });
};


// 冻结背景
pro[_freezeBackground] = function () {
    if (!windowMaskLength) {
        htmlElLatestMarginTop = attribute.style(htmlEl, 'marginTop');
        windowLatestScrollTop = layout.scrollTop(win);
        attribute.style(htmlEl, {
            marginTop: -windowLatestScrollTop
        });
        attribute.addClass(htmlEl, freezeClassName);
    }

    // windowMaskList.push(the[_maskId]);
    windowMaskLength++;
};


// 解冻背景
pro[_unfreezeBackground] = function () {
    windowMaskLength--;

    if (!windowMaskLength) {
        attribute.removeClass(htmlEl, freezeClassName);
        attribute.style(htmlEl, {
            marginTop: htmlElLatestMarginTop
        });
        layout.scrollTop(win, windowLatestScrollTop);
    }
    // windowMaskList.pop();
};


require('./style.css', 'css|style');
Mask.defaults = defaults;
module.exports = Mask;
