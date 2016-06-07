/**
 * 遮罩层
 * @author ydr.me
 * @create 2016-04-20 16:56
 */



'use strict';
 
var object =       require('blear.utils.object');
var typeis =       require('blear.utils.typeis');
var fun =          require('blear.utils.function');
var selector =     require('blear.core.selector');
var attribute =    require('blear.core.attribute');
var event =        require('blear.core.event');
var Window =       require('blear.ui.window');
var UI =           require('blear.ui');
var template =     require('./template.html', 'html');


var uiIndex = 0;
var uiClass = UI.UI_CLASS + '-mask';
var win = window;
var doc = win.document;
var defaults = {
    bgColor: 'black',
    opacity: 0.5,
    addClass: '',
    openAnimation: null,
    resizeAnimation: null,
    closeAnimation: null,
    animation: function (to, done) {
        attribute.style(this.getElement(), to);
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

    /**
     * 设置 HTML
     * @param html {String|Node}
     * @returns {HTMLElement}
     */
    setHTML: function (html) {
        var the = this;

        if (typeis.String(html)) {
            attribute.html(the[_maskEl], html);
        } else if (html && html.nodeType) {
            modification.empty(the[_maskEl]);
            modification.insert(html, the[_maskEl]);
        }

        Mask.parent.update(the);

        return selector.children(the[_maskEl])[0];
    },

    /**
     * 销毁实例
     */
    destroy: function (callback) {
        var the = this;

        callback = fun.noop(callback);
        callback = fun.bind(callback, the);
        event.un(the.getElement(), 'click');
        Mask.parent.destroy(the, callback);
    }
});
var _maskEl = Mask.sole();
var _options = Mask.sole();
var _initNode = Mask.sole();
var _initEvent = Mask.sole();


/**
 * 初始化节点
 */
Mask.method(_initNode, function () {
    var the = this;
    var options = the[_options];

    // init node
    the[_maskEl] = Mask.parent.setHTML(the, template);
    attribute.style(the[_maskEl], {
        backgroundColor: options.bgColor,
        opacity: options.opacity
    });
});


/**
 * 初始化事件
 */
Mask.method(_initEvent, function () {
    var the = this;
    var options = the[_options];

    // init event
    the.on('beforeOpen', function (pos) {
        pos.top = 0;
        pos.right = 0;
        pos.bottom = 0;
        pos.left = 0;
        pos.width = '100%';
        pos.height = '100%';
    });
    event.on(the.getElement(), 'click', function () {
        the.emit('hit');
    });
});


require('./style.css', 'css|style');
Mask.defaults = defaults;
module.exports = Mask;
