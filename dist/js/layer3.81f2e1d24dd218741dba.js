webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(13)

var Component = __webpack_require__(19)(
  /* script */
  __webpack_require__(7),
  /* template */
  __webpack_require__(20),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/yaya/Desktop/project/learn/webpack-pages/src/pages/layer3/layer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] layer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-19c1df93", Component.options)
  } else {
    hotAPI.reload("data-v-19c1df93", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {
            msg: 'Hello world!',
            word: 'ABC',
            amount: 120,
            show: true
        };
    },

    filters: {
        lowercase: function lowercase(value) {
            return value.toString().toLowerCase();
        },
        currency: function currency(value) {
            return (value / 100).toFixed(2);
        }
    },
    methods: {
        b_click: function b_click(e) {
            console.log(e);
            console.log(e.target);
        },
        key_enter: function key_enter() {
            console.log('点击了enter键');
        }
    }
};

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(6);

var _vue2 = _interopRequireDefault(_vue);

var _layer = __webpack_require__(5);

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _vue2.default({
    el: '#app',
    template: '<App/>',
    components: { App: _layer2.default }
});
console.log('666');

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/218-102db.png";

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._v("\n    " + _vm._s(_vm._f("lowercase")(_vm.word)) + " " + _vm._s(_vm._f("currency")(_vm.amount)) + "\n    "), _c('button', {
    staticClass: "b_click",
    on: {
      "key": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.key_enter($event)
      }
    }
  }, [_vm._v("点击enter键")]), _vm._v(" "), _c('button', {
    staticClass: "b_click",
    on: {
      "click": function($event) {
        _vm.b_click($event)
      },
      "key": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.key_enter($event)
      }
    }
  }, [_vm._v("测试$event参数")]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "demo_transition"
    }
  }, [_c('button', {
    on: {
      "click": function($event) {
        _vm.show = !_vm.show
      }
    }
  }, [_vm._v("\n            Toggle\n        ")]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.show) ? _c('p', [_vm._v("hello+++Toggle")]) : _vm._e()]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "slide-fade"
    }
  }, [(_vm.show) ? _c('p', [_vm._v("hello+++Toggle render")]) : _vm._e()]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "bounce"
    }
  }, [(_vm.show) ? _c('p', [_vm._v("Look at me!")]) : _vm._e()])], 1), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('div', {
    staticClass: "example"
  }, [_vm._v(_vm._s(_vm.msg))]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "layer"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(17)
    }
  }), _vm._v(" "), _c('div', [_vm._v("this is a layer333333333")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "layer1"
  }, [_c('div')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-19c1df93", module.exports)
  }
}

/***/ })
],[10]);
//# sourceMappingURL=layer3.81f2e1d24dd218741dba.js.map