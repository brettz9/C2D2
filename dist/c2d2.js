(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.C2D2 = factory());
}(this, function () { 'use strict';

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

  /* eslint-env node */

  /**
  * @todo Switch to ES6 modules and build to `dist` with Rollup
  * @todo Resume ensuring properties/methods are added and any todos noted for potential to accept specific arguments as wrapped objects or return wrapped items: {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dfnReturnLink-0}
  * @todo add with package.json (including Node dependencies) to npm
  * @todo Add tests, including for window, Node, AMD
  * @todo Add shim plugin dependency once ready
  */
  function _forEach(arr, h) {
    for (var i = 0, arrl = arr.length; i < arrl; i++) {
      h(arr[i], i);
    }
  }

  function _arrayify(begin) {
    var args = arguments;

    if (typeof begin === 'string') {
      args = [];
      var coords = begin.trim().replace(/\s*,\s+/g, ', ').split(/\s+/);

      _forEach(coords, function (item, idx) {
        args[idx] = item.split(', ');
      });
    }

    return args;
  } // Adds NodeJS support, and exports interface to modules that require this module


  var w = typeof window === 'undefined' ? global : window; // This should not be needed by Node

  function buildMethod(m) {
    return function () {
      var _this$parent;

      (_this$parent = this.parent)[m].apply(_this$parent, arguments);

      return this;
    };
  }

  function buildGetterMethod(gm, methodFromProperty, WrapperClass) {
    return function (imageData) {
      var _this$parent2;

      var args = [].slice.call(arguments);

      if (gm === 'putImageData' && _typeof(imageData) === 'object' && imageData.imageData) {
        // Todo: Hackish check for taking regular ImageData object
        args[0] = imageData.imageData;
      }

      if (methodFromProperty) {
        return new WrapperClass(this.parent[gm]);
      }

      return new WrapperClass((_this$parent2 = this.parent)[gm].apply(_this$parent2, _toConsumableArray(args)));
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
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      method.apply(this, args);
      return this;
    };
  } // Todo: Wrap up any specific methods or properties which might be used on the opaque pattern and
  //     gradient child objects, if ever exposed, so that these can be properly wrapped and made chainable.


  var DelegateChain = {
    addMethods: function addMethods(methods, clss) {
      for (var i = 0, methl = methods.length; i < methl; i++) {
        var m = methods[i];
        clss.prototype[m] = buildMethod(m);
      }
    },
    addGetterMethods: function addGetterMethods(getterMethods, clss, WrapperClass, methodFromProperty) {
      for (var i = 0, gmethl = getterMethods.length; i < gmethl; i++) {
        var gm = getterMethods[i];

        if (WrapperClass) {
          clss.prototype[gm] = buildGetterMethod(gm, methodFromProperty, WrapperClass);
        } else {
          // For those which return a literal
          clss.prototype[gm] = buildLiteralGetterMethod(gm);
        }
      }
    },
    addPropertyMethods: function addPropertyMethods(props, clss) {
      for (var i = 0, propl = props.length; i < propl; i++) {
        var p = props[i];
        clss.prototype[p] = buildPropertyMethod(p);
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
  // If never any benefits to wrapping (with chainable new methods), just avoid making this child class


  function C2D2Pattern(patternObj) {
    // if (!C2D2Pattern.prototype.width) { // no known properties/methods
    //    _C2D2PatternSetup();
    // }
    this.parent = this.pattern = patternObj;
    return patternObj; // Just return the object for now, as appears there will be no need to wrap
  }

  function _C2D2ContextSetup() {
    // Predefined methods
    var methods = ['addHitRegion', 'arc', 'arcTo', 'beginPath', 'bezierCurveTo', 'clearRect', 'clip', 'closePath', 'commit', 'drawImage', 'drawSystemFocusRing', 'ellipse', 'fill', 'fillRect', 'fillText', 'getLineDash', 'lineTo', 'moveTo', 'quadraticCurveTo', 'rect', 'removeHitRegion', 'resetClip', 'resetTransform', 'restore', 'rotate', 'save', 'scale', 'scrollPathIntoView', 'setLineDash', 'setTransform', 'stroke', 'strokeRect', 'strokeText', 'transform', 'translate']; // drawFocusRing not currently supported
    // Todo: Implement these to be wrapped so can get and set data in their own child chains
    // Todo: createPattern is a wholly opaque object, so might need to have child wrappers
    //    if implementing any known methods in the future

    var imageDataGetterMethods = ['createImageData', 'createImageDataHD', 'getImageData', 'getImageDataHD', 'putImageData', 'putImageDataHD'],
        gradientGetterMethods = ['createLinearGradient', 'createRadialGradient'],
        patternGetterMethods = ['createPattern'],
        // Todo: createPattern to accept wrapped canvas element or context?
    // Do not return 'this' object since purpose is to get (and the objects they create don't have more than
    // one method to make it desirable to chain, except for ImageData ones, moved to childGetterMethods
    getterMethods = ['drawCustomFocusRing', 'isPointInPath', 'isPointInStroke', 'measureText']; // wrap TextMetrics of measureText?
    // Predefined properties

    var props = ['canvas', 'currentTransform', 'direction', 'fillStyle', 'font', 'globalAlpha', 'globalCompositeOperation', 'imageSmoothingEnabled', 'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor', 'strokeStyle', 'textAlign', 'textBaseline']; // Todo: fillStyle and strokeStyle to return or be settable with wrapped CanvasGradient or CanvasPattern, currentTransform with wrapped SVGMatrix?

    DelegateChain.addMethods(methods, C2D2Context);
    DelegateChain.addGetterMethods(imageDataGetterMethods, C2D2Context, C2D2ImageData);
    DelegateChain.addGetterMethods(gradientGetterMethods, C2D2Context, C2D2Gradient);
    DelegateChain.addGetterMethods(patternGetterMethods, C2D2Context, C2D2Pattern);
    DelegateChain.addGetterMethods(getterMethods, C2D2Context);
    DelegateChain.addPropertyMethods(props, C2D2Context);
  }

  function c2d2Element(arr, opts) {
    var el = opts;
    var d = w.document || null;
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
      el = d.getElementById(opts);
    } else if (_typeof(opts) === 'object' && bNodeModule) {
      var _require = require('canvas'),
          createCanvas = _require.createCanvas;

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
        var fs = require('fs');

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

      if (opts['class'] || opts.className) {
        el.setAttribute('class', opts['class'] || opts.className);
      }

      parent = opts.appendTo ? typeof opts.appendTo === 'string' ? d.getElementById(opts.appendTo) : opts.appendTo : d.body;
    } else if (opts === undefined) {
      el = d.getElementsByTagName('canvas')[0];
    }

    if (!noArray && el.setAttribute) {
      el.setAttribute('width', arr[0]);
      el.setAttribute('height', arr[1]);
    }

    if (parent) {
      parent.appendChild(el);
    }

    if (w.G_vmlCanvasManager) {
      // If using ExplorerCanvas to get IE support: http://code.google.com/p/explorercanvas/
      el = w.G_vmlCanvasManager.initElement(el);
    }

    return el;
  }
  /**
  * Wraps CanvasRenderingContext2D
  * @todo Could make generic CanvasContext to accept "type" as a property when not '2d'
  */

  function C2D2Context(arr, opts) {
    if (!(this instanceof C2D2Context)) {
      return new C2D2Context(arr, opts);
    }

    var el = this.canvas = c2d2Element(arr, opts);
    this.context = this.parent = el.getContext('2d');

    if (!C2D2Context.prototype.arc) {
      _C2D2ContextSetup();
    } // Expose the c2d2Element properties (todo: could use Object.defineProperty to ensure stayed in sync)


    this.width = el.width;
    this.height = el.height;
    return this; // Satisfy Netbeans
  }

  _forEach(['transferControlToProxy', // Todo: Wrap this method's CanvasProxy return result?
  'getContext', 'probablySupportsContext', 'supportsContext', 'setContext', 'toDataURL', 'toDataURLHD', 'toBlob', 'toBlobHD'], function (method) {
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
    $line: function $line(obj, close) {
      var a;

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

        a = _arrayify.apply(null, obj.coords || obj.xy || obj.path);
      } else {
        a = _arrayify.apply(null, arguments);
      }

      this.beginPath().moveTo.apply(this, a[0]);

      for (var i = 1, argl = a.length; i < argl; i++) {
        this.lineTo.apply(this, _toConsumableArray(a[i]));
      }

      if (close || obj.close) {
        this.closePath();
      }

      this.stroke();
    },
    $fill: function $fill(obj) {
      var a;

      if (obj && _typeof(obj) === 'object' && !obj.length) {
        if (obj.color) {
          this.$fillColor(obj.color);
        }

        if (obj.shadow || obj.$shadow) {
          this.$shadow(obj.shadow);
        }

        a = _arrayify.apply(null, obj.coords || obj.xy || obj.path);
      } else {
        a = _arrayify.apply(null, arguments);
      }

      if (a[0].length === 4) {
        return this.$fillRect.apply(this, _toConsumableArray(a));
      }

      this.beginPath().moveTo.apply(this, a[0]);

      for (var i = 1, argl = a.length; i < argl; i++) {
        this.lineTo.apply(this, _toConsumableArray(a[i]));
      }

      this.fill();
    },
    $clear: function $clear() {
      this.$clearRect.apply(this, arguments);
    },
    $fillRect: function $fillRect(x, y, w, h) {
      if (x && _typeof(x) === 'object' && x.length) {
        for (var i = 0, argl = arguments.length; i < argl; i++) {
          this.$fillRect.apply(this, _toConsumableArray(arguments[i])); // Allow array for coordinates
        }

        return this;
      }

      this.fillRect(x || 0, y || 0, w || this.width, h || this.height);
    },
    $clearRect: function $clearRect(x, y, w, h) {
      if (x && _typeof(x) === 'object' && x.length) {
        for (var i = 0, argl = arguments.length; i < argl; i++) {
          this.$clearRect.apply(this, _toConsumableArray(arguments[i])); // Allow array for coordinates
        }

        return this;
      }

      this.clearRect(x || 0, y || 0, w || this.width, h || this.height);
    },
    // $rect, $clip, $arcTo
    $strokeRect: function $strokeRect(x, y, w, h) {
      if (x && _typeof(x) === 'object' && x.length) {
        for (var i = 0, argl = arguments.length; i < argl; i++) {
          this.$strokeRect.apply(this, _toConsumableArray(arguments[i])); // Allow array for coordinates
        }

        return this;
      }

      this.strokeRect(x || 0, y || 0, w || this.width, h || this.height);
    },
    $arc: function $arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      if (x && _typeof(x) === 'object' && x.length) {
        for (var i = 0, argl = arguments.length; i < argl; i++) {
          this.$arc.apply(this, _toConsumableArray(arguments[i])); // Allow array for coordinates
        }

        return this;
      }

      this.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    },
    $quadraticCurve: function $quadraticCurve() {
      this.$quadratic.apply(this, arguments);
    },
    $quadraticCurveTo: function $quadraticCurveTo() {
      this.$quadratic.apply(this, arguments);
    },
    $quadratic: function $quadratic(cp1x, cp1y, x, y) {
      if (cp1x && _typeof(cp1x) === 'object' && cp1x.length) {
        for (var i = 0, argl = arguments.length; i < argl; i++) {
          this.$quadratic.apply(this, _toConsumableArray(arguments[i])); // Allow array for coordinates
        }

        return this;
      }

      this.quadraticCurveTo(cp1x, cp1y, x, y);
    },
    $bezierCurve: function $bezierCurve() {
      this.$bezier.apply(this, arguments);
    },
    $bezierCurveTo: function $bezierCurveTo() {
      this.$bezier.apply(this, arguments);
    },
    $bezier: function $bezier(cp1x, cp1y, cp2x, cp2y, x, y) {
      if (cp1x && _typeof(cp1x) === 'object' && cp1x.length) {
        for (var i = 0, argl = arguments.length; i < argl; i++) {
          this.$bezier.apply(this, _toConsumableArray(arguments[i])); // Allow array for coordinates
        }

        return this;
      }

      this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
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
      } else if (typeof x === 'string' && x.indexOf(', ') !== -1) {
        var _x$split = x.split(/\s*,\s*/);

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
      var _this = this;

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

        if (att === 'offset') {
          // Offer additional property to get the coords together
          _this.$shadowOffset(shadowOffset);
        } else {
          _this["$shadow".concat(att.charAt(0).toUpperCase() + att.slice(1))](shadowOffset);
        }
      });
      return this;
    }
  });

  C2D2Context.randomNumber = function (min, max) {
    min = min || 0;
    max = max || 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }; // See also the individual methods which use this (allowing "random" as a "color" argument)


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
  /**
  Useful for separation of concerns, detecting the CSS style rule for a given class, id, or other selector and applying it as an argument to a canvas method, so that the JavaScript does not need to be concerned with secondary styling (of course the images it generates is a kind of style)
  */


  C2D2Context.getCSSPropertyValue = function (selectorText, propertyName, sheet) {
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
            propertyName = propertyName.replace(/-([a-z])/g, String.prototype.toUpperCase);
            return rule.style[propertyName];
          }
        }
      }

      return false;
    }
    var ss, val;

    if (sheet !== undefined) {
      ss = document.styleSheets[sheet];
      return _getPropertyFromStyleSheet(ss, selectorText, propertyName);
    }

    for (var i = 0, dsl = document.styleSheets.length; i < dsl; i++) {
      ss = document.styleSheets[i];
      val = _getPropertyFromStyleSheet(ss, selectorText, propertyName);

      if (val) {
        break;
      }
    }

    return val;
  }; // Attach classes for sake of extensibility (or utilization for canvasElement)


  C2D2Context.CanvasPixelArray = C2D2CanvasPixelArray;
  C2D2Context.ImageData = C2D2ImageData;
  C2D2Context.Gradient = C2D2Gradient;
  C2D2Context.Pattern = C2D2Pattern;
  C2D2Context.canvasElement = c2d2Element;

  return C2D2Context;

}));
