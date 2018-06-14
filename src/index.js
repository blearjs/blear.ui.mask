/**
 * 遮罩层
 * @author ydr.me
 * @create 2016-04-20 16:56
 * @ref https://uedsky.com/2016-06/mobile-modal-scroll/#解决方案-position-fixed
 */



'use strict';

var object = require('blear.utils.object');
var fun = require('blear.utils.function');
var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');
var layout = require('blear.core.layout');
var event = require('blear.core.event');
var Window = require('blear.ui.window');
var UI = require('blear.ui');
var Animation = require('blear.classes.animation');

var template = require('./template.html', 'html');


var UIIndex = 0;
var UIClassName = UI.UI_CLASS + '-mask';
var freezeClassName = UIClassName + '-freeze';
var win = window;
var doc = win.document;
var htmlEl = doc.documentElement;
var bodyEl = doc.body;
var windowMaskLength = 0;
var bodyElLatestTop = 0;
var bodyElLatestRight = 0;
var windowLatestScrollTop = 0;
var scrollBarWidth = calScrollBarWidth();
var namespace = 'blearui-mask';
var defaults = object.assign(true, {}, Window.defaults, {
    bgColor: 'black',
    opacity: 0.5,
    topRate: 0,
    leftRate: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    openAnimation: function (to, done) {
        var the = this;
        var el = the.getWindowEl();
        var an = new Animation(el, the.getOptions('animationOptions'));

        attribute.style(el, {
            opacity: 0
        });
        an.transit(to);
        an.start(function () {
            an.destroy();
            done();
        });
    },
    closeAnimation: function (to, done) {
        var the = this;
        var el = the.getWindowEl();
        var an = new Animation(el, the.getOptions('animationOptions'));

        an.transit({
            opacity: 0
        });
        an.start(function () {
            an.destroy();
            done();
        });
    }
});

var Mask = Window.extend({
    className: 'Mask',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign(true, {}, defaults, options);
        options.addClass += ' ' + namespace;
        Mask.parent(the, options);
        the[_initEvent]();
    },

    /**
     * 获取配置
     * @param key
     * @returns {*}
     */
    getOptions: function (key) {
        return UI.getOptions(this, _options, key);
    },

    /**
     * 获取配置
     * @param key
     * @param val
     * @returns {*}
     */
    setOptions: function (key, val) {
        return UI.setOptions(this, _options, key, val);
    },

    /**
     * 销毁实例
     */
    destroy: function (callback) {
        var the = this;

        callback = fun.ensure(callback);
        callback = fun.bind(callback, the);
        event.un(the.getWindowEl(), 'click');
        Mask.invoke('destroy', the, callback);
    }
});
var pro = Mask.prototype;
var sole = Mask.sole;
var _maskEl = sole();
var _maskId = sole();
var _options = sole();
var _initNode = sole();
var _initEvent = sole();
var _freezeBackground = sole();
var _unfreezeBackground = sole();


/**
 * 初始化节点
 */
pro[_initNode] = function () {
    var the = this;

    // init node
    the[_maskEl] = Mask.invoke('setHTML', the, template);
    the[_maskId] = UIIndex++;
};


/**
 * 初始化事件
 */
pro[_initEvent] = function () {
    var the = this;
    var options = the[_options];

    // init event
    the.on('beforeOpen', function (pos) {
        pos.backgroundColor = options.bgColor;
        pos.opacity = options.opacity;
        pos.right = pos.bottom = 0;
        pos.width = pos.height = 'auto';
        // the[_freezeBackground]();
    });

    // the.on('afterClose', function () {
    //     // the[_unfreezeBackground]();
    // });

    event.on(the.getWindowEl(), 'click', function (ev) {
        the.emit('hit', ev);
    });
};


// // 冻结背景
// pro[_freezeBackground] = function () {
//     if (!windowMaskLength) {
//         bodyElLatestTop = attribute.style(bodyEl, 'top');
//         bodyElLatestRight = attribute.style(bodyEl, 'right');
//         windowLatestScrollTop = layout.scrollTop(win);
//         attribute.style(bodyEl, {
//             top: -windowLatestScrollTop,
//             right: scrollBarWidth
//         });
//         attribute.addClass(bodyEl, freezeClassName);
//     }
//
//     windowMaskLength++;
// };
//
//
// // 解冻背景
// pro[_unfreezeBackground] = function () {
//     windowMaskLength--;
//
//     if (!windowMaskLength) {
//         attribute.removeClass(bodyEl, freezeClassName);
//         attribute.style(bodyEl, {
//             top: bodyElLatestTop,
//             right: bodyElLatestRight
//         });
//         layout.scrollTop(win, windowLatestScrollTop);
//     }
// };

require('./style.css', 'css|style');
Mask.defaults = defaults;
module.exports = Mask;

// ====================================
function calScrollBarWidth() {
    var div1El = modification.create('div', {
        style: {
            width: 100,
            height: 100,
            overflow: 'auto'
        }
    });
    var div2El = modification.create('div', {
        style: {
            width: 200,
            height: 200
        }
    });

    modification.insert(div2El, div1El);
    modification.insert(div1El);
    var width = div1El.offsetWidth - div1El.clientWidth;
    modification.remove(div1El);
    div1El = div2El = null;
    return width;
}
