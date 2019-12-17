(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.C2D2 = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /* globals require */

  /**
  * @todo Resume ensuring properties/methods are added and any todos noted
  * for potential to accept specific arguments as wrapped objects or
  * return wrapped items: {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dfnReturnLink-0}
  * @todo Add tests, including for browser and Node
  */
  var fs, createCanvas;

  if (typeof require !== 'undefined') {
    /* eslint-disable global-require */
    var _require = require('canvas');

    createCanvas = _require.createCanvas;
    fs = require('fs');
    /* eslint-enable global-require */
  } // Adds NodeJS support, and exports interface to modules
  //   that require this module
  // This should not be needed by Node


  var win = typeof window === 'undefined' ? global : window;

  function buildMethod(m) {
    return function () {
      var _this$parent;

      (_this$parent = this.parent)[m].apply(_this$parent, arguments);

      return this;
    };
  }

  function buildGetterMethod(gm, methodFromProperty, WrapperClass) {
    return function () {
      var _this$parent2;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var imageData = args[0];

      if (gm === 'putImageData' && _typeof(imageData) === 'object' && imageData.imageData) {
        // Todo: Hackish check for taking regular ImageData object
        args[0] = imageData.imageData;
      }

      if (methodFromProperty) {
        return new WrapperClass(this.parent[gm]);
      }

      return new WrapperClass((_this$parent2 = this.parent)[gm].apply(_this$parent2, args));
    };
  }

  function buildLiteralGetterMethod(gm) {
    return function () {
      var _this$parent3;

      return (_this$parent3 = this.parent)[gm].apply(_this$parent3, arguments);
    };
  }

  function buildPropertyMethod(p) {
    return function (value) {
      if (value === undefined) {
        return this.parent[p];
      }

      this.parent[p] = value;
      return this;
    };
  }

  function buildContextMethods(method) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      method.apply(this, args);
      return this;
    };
  } // Todo: Wrap up any specific methods or properties which might be
  //   used on the opaque pattern and gradient child objects, if ever
  //   exposed, so that these can be properly wrapped and made chainable.


  var DelegateChain = {
    addMethods: function addMethods(methods, clss) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method = _step.value;
          clss.prototype[method] = buildMethod(method);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    addGetterMethods: function addGetterMethods(getterMethods, clss, WrapperClass, methodFromProperty) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = getterMethods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var getterMethod = _step2.value;

          if (WrapperClass) {
            clss.prototype[getterMethod] = buildGetterMethod(getterMethod, methodFromProperty, WrapperClass);
          } else {
            // For those which return a literal
            clss.prototype[getterMethod] = buildLiteralGetterMethod(getterMethod);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    },
    addPropertyMethods: function addPropertyMethods(props, clss) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var prop = _step3.value;
          clss.prototype[prop] = buildPropertyMethod(prop);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  };

  function _C2D2CanvasPixelArraySetup() {
    var props = ['length']; // We'll just use this commonly used accessor name

    C2D2CanvasPixelArray.prototype.item = function (value, value2) {
      if (value2 === undefined) {
        return this.parent[value];
      }

      this.parent[value] = value2;
      return this;
    }; //  even though not part of standard interface (not specified)


    DelegateChain.addPropertyMethods(props, C2D2CanvasPixelArray);
  }

  function C2D2CanvasPixelArray(canvasPixelArrayObj) {
    if (!C2D2CanvasPixelArray.prototype.length) {
      _C2D2CanvasPixelArraySetup();
    }

    this.parent = this.array = this.pixelArray = canvasPixelArrayObj;
  }

  function _C2D2ImageDataSetup() {
    var props = ['width', 'height', 'resolution' // Todo: The latter is read-only
    ],
        getterMethods = ['data'];
    DelegateChain.addGetterMethods(getterMethods, C2D2ImageData, C2D2CanvasPixelArray, true);
    DelegateChain.addPropertyMethods(props, C2D2ImageData);
  }

  function C2D2ImageData(imageDataObj) {
    if (!C2D2ImageData.prototype.width) {
      _C2D2ImageDataSetup();
    }

    this.parent = this.imageData = imageDataObj;
  }

  function _C2D2GradientSetup() {
    var methods = ['addColorStop'];
    DelegateChain.addMethods(methods, C2D2Gradient);
  } // Partly opaque


  function C2D2Gradient(gradientObj) {
    if (!C2D2Gradient.prototype.addColorStop) {
      _C2D2GradientSetup();
    }

    this.parent = this.gradient = gradientObj;
  } // function _C2D2PatternSetup () {
  //      Fully opaque
  // }
  // Fully opaque
  // If never any benefits to wrapping (with chainable new methods),
  //  just avoid making this child class


  function C2D2Pattern(patternObj) {
    // if (!C2D2Pattern.prototype.width) { // no known properties/methods
    //    _C2D2PatternSetup();
    // }
    this.parent = this.pattern = patternObj; // Just return the object for now, as appears there will be no need to wrap

    return patternObj;
  }

  function _C2D2ContextSetup() {
    // Predefined methods
    var methods = ['addHitRegion', 'arc', 'arcTo', 'beginPath', 'bezierCurveTo', 'clearRect', 'clip', 'closePath', 'commit', 'drawImage', 'drawSystemFocusRing', 'ellipse', 'fill', 'fillRect', 'fillText', 'getLineDash', 'lineTo', 'moveTo', 'quadraticCurveTo', 'rect', 'removeHitRegion', 'resetClip', 'resetTransform', 'restore', 'rotate', 'save', 'scale', 'scrollPathIntoView', 'setLineDash', 'setTransform', 'stroke', 'strokeRect', 'strokeText', 'transform', 'translate']; // drawFocusRing not currently supported
    // Todo: Implement these to be wrapped so can get and set data in
    //   their own child chains
    // Todo: `createPattern` is a wholly opaque object, so might need to
    //    have child wrappers if implementing any known methods in the future

    var imageDataGetterMethods = ['createImageData', 'createImageDataHD', 'getImageData', 'getImageDataHD', 'putImageData', 'putImageDataHD'];
    var gradientGetterMethods = ['createLinearGradient', 'createRadialGradient']; // Todo: createPattern to accept wrapped canvas element or context?

    var patternGetterMethods = ['createPattern']; // Do not return 'this' object since purpose is to get (and the
    //  objects they create don't have more than one method to make it
    //  desirable to chain, except for ImageData ones, moved to
    //  `childGetterMethods`

    var getterMethods = ['drawCustomFocusRing', 'isPointInPath', 'isPointInStroke', 'measureText']; // wrap `TextMetrics` of `measureText`?
    // Predefined properties
    // Todo: `fillStyle` and `strokeStyle` to return or be settable with
    //  wrapped `CanvasGradient` or `CanvasPattern`, `currentTransform` with
    //  wrapped `SVGMatrix`?

    var props = ['canvas', 'currentTransform', 'direction', 'fillStyle', 'font', 'globalAlpha', 'globalCompositeOperation', 'imageSmoothingEnabled', 'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor', 'strokeStyle', 'textAlign', 'textBaseline'];
    DelegateChain.addMethods(methods, C2D2Context);
    DelegateChain.addGetterMethods(imageDataGetterMethods, C2D2Context, C2D2ImageData);
    DelegateChain.addGetterMethods(gradientGetterMethods, C2D2Context, C2D2Gradient);
    DelegateChain.addGetterMethods(patternGetterMethods, C2D2Context, C2D2Pattern);
    DelegateChain.addGetterMethods(getterMethods, C2D2Context);
    DelegateChain.addPropertyMethods(props, C2D2Context);
  }

  function c2d2Element(arr, opts) {
    var el = opts;
    var d = win.document || null;
    var noArray = _typeof(arr) !== 'object' || !arr.length;

    if (noArray) {
      el = opts = arr;
      arr = [];
    } else {
      opts = opts || {};
    }

    var bNodeModule = opts && (opts.path || opts.fileStream);
    var parent; // Todo: deal with string w/h coords, number w/h coords

    if (typeof opts === 'string') {
      el = d.querySelector('#' + opts);
    } else if (_typeof(opts) === 'object' && bNodeModule) {
      el = createCanvas();
      var width = arr[0] || opts.width || opts.w;
      var height = arr[1] || opts.height || opts.h;

      if (width) {
        el.width = width;
      }

      if (height) {
        el.height = height;
      }

      var path = opts.fileStream || opts.path;

      if (path) {
        var out = fs.createWriteStream(path);
        var stream = el.createPNGStream();
        stream.on('data', function (chunk) {
          out.write(chunk);
        });
        stream.on('end', function () {
          out.end();
        });
      }
    } else if (_typeof(opts) === 'object' && !opts.nodeName) {
      el = d.createElementNS && d.documentElement.namespaceURI !== null ? d.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') : d.createElement('canvas');

      if (opts.width || opts.w) {
        el.setAttribute('width', opts.width || opts.w);
      }

      if (opts.height || opts.h) {
        el.setAttribute('height', opts.height || opts.h);
      }

      if (opts.id) {
        el.setAttribute('id', opts.id);
      }

      if (opts.style) {
        // Better to use a class instead
        el.setAttribute('style', opts.style);
      }

      if (opts.innerHTML) {
        // For fallback display
        el.innerHTML = opts.innerHTML;
      }

      if (opts["class"] || opts.className) {
        el.setAttribute('class', opts["class"] || opts.className);
      }

      parent = opts.appendTo ? typeof opts.appendTo === 'string' ? d.querySelector('#' + opts.appendTo) : opts.appendTo : d.body;
    } else if (opts === undefined) {
      el = d.querySelector('canvas');
    }

    if (!noArray && el.setAttribute) {
      el.setAttribute('width', arr[0]);
      el.setAttribute('height', arr[1]);
    }

    if (parent) {
      parent.append(el);
    }

    if (win.G_vmlCanvasManager) {
      // If using ExplorerCanvas to get IE support: http://code.google.com/p/explorercanvas/
      el = win.G_vmlCanvasManager.initElement(el);
    }

    return el;
  }
  /**
  * @typedef {PlainObject} WidthHeight
  * @property {Float} 0
  * @property {Float} 1
  */

  /**
  * Wraps `CanvasRenderingContext2D`.
  * @class
  * @todo Could make generic CanvasContext to accept "type" as a
  *  property when not '2d'
  * @param {WidthHeight} arr
  * @param {PlainObject} opts
  */


  function C2D2Context(arr, opts) {
    // eslint-disable-next-line no-restricted-syntax
    if (!(this instanceof C2D2Context)) {
      return new C2D2Context(arr, opts);
    }

    var el = this.canvas = c2d2Element(arr, opts);
    this.context = this.parent = el.getContext('2d');

    if (!C2D2Context.prototype.arc) {
      _C2D2ContextSetup();
    } // Expose the c2d2Element properties (todo: could use
    //  `Object.defineProperty` to ensure stayed in sync)


    this.width = el.width;
    this.height = el.height;
    return this; // Satisfy Netbeans
  } // Expose the c2d2Element methods
  // Todo: Wrap this method's CanvasProxy return result?


  ['transferControlToProxy', 'getContext', 'probablySupportsContext', 'supportsContext', 'setContext', 'toDataURL', 'toDataURLHD', 'toBlob', 'toBlobHD'].forEach(function (method) {
    C2D2Context.prototype[method] = function () {
      var _this$canvas;

      return (_this$canvas = this.canvas)[method].apply(_this$canvas, arguments);
    };
  });

  C2D2Context.addMethods = function (methodMap) {
    Object.entries(methodMap).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          methodName = _ref2[0],
          method = _ref2[1];

      C2D2Context.prototype[methodName] = buildContextMethods(method);
    });
  }; // Unlike addMethods, requires manually supplying 'this' at the end


  C2D2Context.extend = function (obj) {
    // Keeps constructor property in tact
    Object.entries(obj).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          propertyName = _ref4[0],
          propertyValue = _ref4[1];

      C2D2Context.prototype[propertyName] = propertyValue;
    });
  }; // EXTENSIONS


  C2D2Context.addMethods({
    $line: function $line() {
      var _this = this;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var obj = args[0],
          close = args[1];
      var a = args;

      if (obj && _typeof(obj) === 'object' && !obj.length) {
        if (obj.color) {
          this.$lineColor(obj.color);
        }

        if (obj.width || obj.w) {
          this.lineWidth(obj.width || obj.w);
        }

        if (obj.shadow || obj.$shadow) {
          this.$shadow(obj.shadow);
        }

        a = _toConsumableArray(obj.coords || obj.xy || obj.path);
      }

      this.beginPath().moveTo.apply(this, a[0]);
      a.slice(1).forEach(function (aItem) {
        _this.lineTo.apply(_this, _toConsumableArray(aItem));
      });

      if (close || obj.close) {
        this.closePath();
      }

      this.stroke();
    },
    $fill: function $fill() {
      var _this2 = this;

      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var obj = args[0];
      var a = args;

      if (obj && _typeof(obj) === 'object' && !obj.length) {
        if (obj.color) {
          this.$fillColor(obj.color);
        }

        if (obj.shadow || obj.$shadow) {
          this.$shadow(obj.shadow);
        }

        a = _toConsumableArray(obj.coords || obj.xy || obj.path);
      }

      if (a[0].length === 4) {
        return this.$fillRect.apply(this, _toConsumableArray(a));
      }

      this.beginPath().moveTo.apply(this, a[0]);
      a.slice(1).forEach(function (aItem) {
        _this2.lineTo.apply(_this2, _toConsumableArray(aItem));
      });
      this.fill();
      return this;
    },
    $clear: function $clear() {
      this.$clearRect.apply(this, arguments);
      return this;
    },
    $fillRect: function $fillRect() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var x = args[0],
          y = args[1],
          w = args[2],
          h = args[3];

      if (x && _typeof(x) === 'object' && x.length) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = args[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var arg = _step4.value;
            this.$fillRect.apply(this, _toConsumableArray(arg)); // Allow array for coordinates
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return this;
      }

      this.fillRect(x || 0, y || 0, w || this.width, h || this.height);
      return this;
    },
    $clearRect: function $clearRect() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      var x = args[0],
          y = args[1],
          w = args[2],
          h = args[3];

      if (x && _typeof(x) === 'object' && x.length) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = args[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var arg = _step5.value;
            this.$clearRect.apply(this, _toConsumableArray(arg)); // Allow array for coordinates
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return this;
      }

      this.clearRect(x || 0, y || 0, w || this.width, h || this.height);
      return this;
    },
    // $rect, $clip, $arcTo
    $strokeRect: function $strokeRect() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      var x = args[0],
          y = args[1],
          w = args[2],
          h = args[3];

      if (x && _typeof(x) === 'object' && x.length) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = args[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var arg = _step6.value;
            // Allow array for coordinates
            this.$strokeRect.apply(this, _toConsumableArray(arg));
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
              _iterator6["return"]();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        return this;
      }

      this.strokeRect(x || 0, y || 0, w || this.width, h || this.height);
      return this;
    },
    $arc: function $arc() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      var x = args[0],
          y = args[1],
          radius = args[2],
          startAngle = args[3],
          endAngle = args[4],
          anticlockwise = args[5];

      if (x && _typeof(x) === 'object' && x.length) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = args[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var arg = _step7.value;
            this.$arc.apply(this, _toConsumableArray(arg)); // Allow array for coordinates
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        return this;
      }

      this.arc(x, y, radius, startAngle, endAngle, anticlockwise);
      return this;
    },
    $quadraticCurve: function $quadraticCurve() {
      this.$quadratic.apply(this, arguments);
    },
    $quadraticCurveTo: function $quadraticCurveTo() {
      this.$quadratic.apply(this, arguments);
    },
    $quadratic: function $quadratic() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      var cp1x = args[0],
          cp1y = args[1],
          x = args[2],
          y = args[3];

      if (cp1x && _typeof(cp1x) === 'object' && cp1x.length) {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = args[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var arg = _step8.value;
            this.$quadratic.apply(this, _toConsumableArray(arg)); // Allow array for coordinates
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
              _iterator8["return"]();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        return this;
      }

      this.quadraticCurveTo(cp1x, cp1y, x, y);
      return this;
    },
    $bezierCurve: function $bezierCurve() {
      this.$bezier.apply(this, arguments);
    },
    $bezierCurveTo: function $bezierCurveTo() {
      this.$bezier.apply(this, arguments);
    },
    $bezier: function $bezier() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      var cp1x = args[0],
          cp1y = args[1],
          cp2x = args[2],
          cp2y = args[3],
          x = args[4],
          y = args[5];

      if (cp1x && _typeof(cp1x) === 'object' && cp1x.length) {
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = args[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var arg = _step9.value;
            this.$bezier.apply(this, _toConsumableArray(arg)); // Allow array for coordinates
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
              _iterator9["return"]();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        return this;
      }

      this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      return this;
    }
  });
  C2D2Context.extend({
    // Don't auto-return 'this' object for these
    $shadowColor: function $shadowColor(value) {
      if (value === 'random') {
        value = C2D2Context.randomColor();
      }

      return this.shadowColor(value);
    },
    $fillColor: function $fillColor(value) {
      // getter or setter
      if (value === 'random') {
        value = C2D2Context.randomColor();
      }

      return this.fillStyle(value);
    },
    $lineColor: function $lineColor(value) {
      // getter or setter
      if (value === 'random') {
        value = C2D2Context.randomColor();
      }

      return this.strokeStyle(value);
    },
    $imageData: function $imageData() {
      if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object' && (arguments.length <= 1 ? undefined : arguments[1]) !== undefined) {
        this.putImageData.apply(this, arguments);
        return this;
      }

      if ((arguments.length <= 2 ? undefined : arguments[2]) !== undefined) {
        return this.getImageData.apply(this, arguments); // data (length), width, height
      }

      return this.createImageData.apply(this, arguments);
    },
    $shadowOffset: function $shadowOffset(x, y) {
      if (x === undefined) {
        return [this.shadowOffsetX(), this.shadowOffsetY()];
      }

      if (_typeof(x) === 'object' && !y && x.length) {
        y = x[1];
        x = x[0];
      } else if (typeof x === 'string' && x.includes(', ')) {
        var _x$split = x.split(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*,[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*/);

        var _x$split2 = _slicedToArray(_x$split, 2);

        x = _x$split2[0];
        y = _x$split2[1];
      }

      this.shadowOffsetX(x).shadowOffsetY(y);
      return this;
    },
    $shadowBlur: function $shadowBlur() {
      // Just a place-holder, at least for now
      this.shadowBlur.apply(this, arguments);
    },
    $shadowOffsetY: function $shadowOffsetY() {
      // Just a place-holder, at least for now
      this.shadowOffsetY.apply(this, arguments);
    },
    $shadowOffsetX: function $shadowOffsetX() {
      // Just a place-holder, at least for now
      this.shadowOffsetX.apply(this, arguments);
    },
    $shadow: function $shadow(sh) {
      var _this3 = this;

      if (sh === undefined) {
        // Not super useful compared to native
        return {
          offset: this.$shadowOffset(),
          blur: this.shadowBlur(),
          color: this.$shadowColor(),
          offsetX: this.shadowOffsetX(),
          offsetY: this.shadowOffsetY()
        };
      }

      Object.entries(sh).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            att = _ref6[0],
            shadowOffset = _ref6[1];

        // Offer additional property to get the coords together
        if (att === 'offset') {
          _this3.$shadowOffset(shadowOffset);
        } else {
          _this3["$shadow".concat(att.charAt(0).toUpperCase() + att.slice(1))](shadowOffset);
        }
      });
      return this;
    }
  });

  C2D2Context.randomNumber = function (min, max) {
    min = min || 0;
    max = max || 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }; // See also the individual methods which use this (allowing
  //  "random" as a "color" argument)


  C2D2Context.randomColor = function (r, g, b, rmax, gmax, bmax) {
    r = r || 0;
    g = g || 0;
    b = b || 0;
    rmax = rmax || 255;
    gmax = gmax || 255;
    bmax = bmax || 255;
    var red = C2D2Context.randomNumber(r, rmax),
        green = C2D2Context.randomNumber(g, gmax),
        blue = C2D2Context.randomNumber(b, bmax);
    return "rgb".concat(red, ", ").concat(green, ", ").concat(blue, ")");
  };

  function _getPropertyFromStyleSheet(ss, selectorText, propertyName) {
    var rules = ss.cssRules || ss.rules; // Mozilla or IE

    for (var j = 0, crl = rules.length; j < crl; j++) {
      var rule = rules[j];

      try {
        if (rule.type === 1 && // CSSRule.STYLE_RULE
        rule.selectorText === selectorText) {
          return rule.style.getPropertyValue(propertyName);
        }
      } catch (err) {
        // IE
        if (rule.selectorText === selectorText) {
          propertyName = propertyName.replace(/\x2D[a-z]/g, String.prototype.toUpperCase);
          return rule.style[propertyName];
        }
      }
    }

    return false;
  }
  /**
  * Useful for separation of concerns, detecting the CSS style rule for a
  * given class, id, or other selector and applying it as an argument to
  * a canvas method, so that the JavaScript does not need to be concerned
  * with secondary styling (of course the images it generates is a kind
  * of style).
  * @param {string} selectorText
  * @param {string} propertyName
  * @param {CSSStyleSheet} sheet
  * @returns {string}
  */


  C2D2Context.getCSSPropertyValue = function (selectorText, propertyName, sheet) {
    var ss, val;

    if (sheet !== undefined) {
      ss = document.styleSheets[sheet];
      return _getPropertyFromStyleSheet(ss, selectorText, propertyName);
    }

    _toConsumableArray(document.styleSheets).some(function (styleSheet) {
      val = _getPropertyFromStyleSheet(styleSheet, selectorText, propertyName);
      return val;
    });

    return val;
  }; // Attach classes for sake of extensibility (or utilization for canvasElement)


  C2D2Context.CanvasPixelArray = C2D2CanvasPixelArray;
  C2D2Context.ImageData = C2D2ImageData;
  C2D2Context.Gradient = C2D2Gradient;
  C2D2Context.Pattern = C2D2Pattern;
  C2D2Context.canvasElement = c2d2Element;

  return C2D2Context;

})));
