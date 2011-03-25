(function (canvasContextClassName, canvasElementClassName,
                    canvasImageDataClassName, canvasGradientClassName, canvasPatternClassName,
                    canvasPixelArrayClassName) {

var w = window, C2D2Element, C2D2Context, C2D2Gradient, C2D2Pattern, C2D2CanvasPixelArray;

// Fix: Wrap up any specific methods or properties which might be used on the opaque pattern and
//     gradient child objects, if ever exposed, so that these can be properly wrapped and made chainable.

var DelegateChain = {
    addMethods : function (methods, className) {
        for (var i = 0, methl = methods.length; i < methl; i++) {
            var m = methods[i];
            w[className].prototype[m] = (function (m) {return function () {
                this.parent[m].apply(this.parent, arguments);
                return this;
            };}(m));
        }
    },
    addGetterMethods : function (getterMethods, className, wrapperClass, methodFromProperty) {
        for (var i = 0, gmethl = getterMethods.length; i < gmethl; i++) {
            var gm = getterMethods[i];
            if (wrapperClass) {
                w[className].prototype[gm] = (function (gm) {return function () {
                    if (gm === 'putImageData' && typeof arguments[0] === 'object' && arguments[0].imageData) { // Fix: Hackish check for taking regular ImageData object
                        arguments[0] = arguments[0].imageData;
                    }
                    if (methodFromProperty) {
                        return new wrapperClass(this.parent[gm]);
                    }
                    return new wrapperClass(this.parent[gm].apply(this.parent, arguments));
                };}(gm));
            }
            else { // For those which return a literal
                w[className].prototype[gm] = (function (gm) {return function () {
                    return this.parent[gm].apply(this.parent, arguments);
                };}(gm));
            }
        }
    },
    addPropertyMethods : function (props, className) {
        for (var i = 0, propl = props.length; i < propl; i++) {
            var p = props[i];
            w[className].prototype[p] = (function (p) {return function (value) {
                if (typeof value === 'undefined') {
                    return this.parent[p];
                }
                this.parent[p] = value;
                return this;
            };}(p));
        }
    }
};

function _C2D2CanvasPixelArraySetup () {
    var props = ['length']; // We'll ust use this commonly used accessor name
    w[canvasPixelArrayClassName].prototype['item'] = function (value, value2) {
        if (typeof value2 === 'undefined') {
            return this.parent[value];
        }
        this.parent[value] = value2;
        return this;
    };
    //  even though not part of standard interface (not specified)
    DelegateChain.addPropertyMethods(props, canvasPixelArrayClassName);
}


C2D2CanvasPixelArray = w[canvasPixelArrayClassName] = function C2D2CanvasPixelArray (canvasPixelArrayObj) {
    if (!C2D2CanvasPixelArray.prototype.length) {
        _C2D2CanvasPixelArraySetup();
    }
    this.parent = this.array = this.pixelArray = canvasPixelArrayObj;
}

function _C2D2ImageDataSetup () {
    var props = ['width', 'height'], getterMethods = ['data'];
    DelegateChain.addGetterMethods(getterMethods, canvasImageDataClassName, C2D2CanvasPixelArray, true);
    DelegateChain.addPropertyMethods(props, canvasImageDataClassName);
}

C2D2ImageData = w[canvasImageDataClassName] = function C2D2ImageData (imageDataObj) {
    if (!C2D2ImageData.prototype.width) {
        _C2D2ImageDataSetup();
    }
    this.parent = this.imageData = imageDataObj;
}

function _C2D2GradientSetup () {
    var methods = ['addColorStop'];
    DelegateChain.addMethods(methods, canvasGradientClassName);
}

// Partly opaque
C2D2Gradient = w[canvasGradientClassName] = function C2D2Gradient (gradientObj) {
    if (!C2D2Gradient.prototype.addColorStop) {
        _C2D2GradientSetup();
    }
    this.parent = this.gradient = gradientObj;
}

function _C2D2PatternSetup () {
    // Fully opaque
}

// Fully opaque
// If never any benefits to wrapping (with chainable new methods), just avoid making this child class
C2D2Pattern = w[canvasPatternClassName] = function C2D2Pattern (patternObj) {
    //if (!C2D2Pattern.prototype.width) { // no known properties/methods
    // _C2D2PatternSetup();
    //}
    this.parent = this.pattern = patternObj;
    return patternObj; // Just return the object for now, as appears there will be no need to wrap
}


function _C2D2ContextSetup () {
    // Predefined methods
    var methods = ['arc','arcTo','beginPath','bezierCurveTo','clearRect',
        'clip','closePath','drawImage','fill','fillRect','fillText','lineTo','moveTo',
        'quadraticCurveTo','rect','restore','rotate','save','scale','setTransform',
        'stroke','strokeRect','strokeText','transform','translate']; // drawFocusRing not currently supported
    DelegateChain.addMethods(methods, canvasContextClassName);

    // Fix: Implement these to be wrapped so can get and set data in their own child chains
    // Fix: createPattern is a wholly opaque object, so might need to have child wrappers
    //    if implementing any known methods in the future
    var imageDataGetterMethods = ['createImageData','getImageData','putImageData'],
        gradientGetterMethods = ['createLinearGradient', 'createRadialGradient'],
        patternGetterMethods = ['createPattern'];
    DelegateChain.addGetterMethods(imageDataGetterMethods, canvasContextClassName, C2D2ImageData);
    DelegateChain.addGetterMethods(gradientGetterMethods, canvasContextClassName, C2D2Gradient);
    DelegateChain.addGetterMethods(patternGetterMethods, canvasContextClassName, C2D2Pattern);

    // Do not return 'this' object since purpose is to get (and the objects they create don't have more than
    // one method to make it desirable to chain, except for ImageData ones, moved to childGetterMethods
    var getterMethods = ['drawFocusRing','isPointInPath','measureText'];
    DelegateChain.addGetterMethods(getterMethods, canvasContextClassName);

    // Predefined properties
    var props = ['canvas','fillStyle','font','globalAlpha','globalCompositeOperation',
        'lineCap','lineJoin','lineWidth','miterLimit','shadowOffsetX','shadowOffsetY',
        'shadowBlur','shadowColor','strokeStyle','textAlign','textBaseline'];
    DelegateChain.addPropertyMethods(props, canvasContextClassName);
}

C2D2Element = w[canvasElementClassName] = function C2D2Element (arr, opts) {
    var d = document, el = opts, parent;
    var noArray = typeof arr !== 'object' || !arr.length;
    if (noArray) {
        el = opts = arr;
        arr = null;
    }
    else {
        opts = opts || {};
    }
// Fix: deal with string w/h coords, number w/h coords
    if (typeof opts === 'string') {
        el = d.getElementById(opts);
    }
    else if (typeof opts === 'object' && !opts.nodeName) {
        el = (d.createElementNS && d.documentElement.namespaceURI !== null) ?
                    d.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') : d.createElement('canvas');
        if (opts.width || opts.w) {
            el.setAttribute('width', opts.width || opts.w);
        }
        if (opts.height || opts.h) {
            el.setAttribute('height', opts.height || opts.h);
        }
        if (opts.id) {
            el.setAttribute('id', opts.id);
        }
        if (opts['class'] || opts.className) {
            el.setAttribute('class', opts['class'] || opts.className);
        }
        parent = opts.appendTo ? typeof opts.appendTo === 'string' ?
                d.getElementById(opts.appendTo) :
                opts.appendTo :
                d.body;
    }
    else if (typeof opts === 'undefined') {
        el = d.getElementsByTagName('canvas')[0];
    }
    if (!noArray) {
        el.setAttribute('width', arr[0]);
        el.setAttribute('height', arr[1]);
    }
    if (parent) {
        parent.appendChild(el);
    }
    if (window.G_vmlCanvasManager) { // If using ExplorerCanvas to get IE support: http://code.google.com/p/explorercanvas/
        el = G_vmlCanvasManager.initElement(el);
    }
    return el;
}

// Could make generic CanvasContext to accept "type" as a property when not '2d'

C2D2Context = w[canvasContextClassName] = function C2D2Context (arr, opts) {
    if (!(this instanceof C2D2Context)) {
        return new C2D2Context(arr, opts);
    }
    var d = document,
        el = this.el = this.canvas = C2D2Element(arr, opts);
    this.context = this.parent = el.getContext('2d');
    if (!C2D2Context.prototype.arc) {
        _C2D2ContextSetup();
    }
    // Expose the C2D2Element properties
    this.width = this.el.width;
    this.height = this.el.height;
    return this; // Satisfy Netbeans
}
// Expose the C2D2Element methods
C2D2Context.prototype.getContext = function () {
    return this.el.getContext.apply(this.el, arguments);
};
C2D2Context.prototype.toDataURL = function () {
    return this.el.toDataURL.apply(this.el, arguments);
};


C2D2Context.addMethods = function (methodMap) {
    for (var m in methodMap) {
        if (methodMap.hasOwnProperty(m)) {
            var method = methodMap[m]; // Fix: Automate adding of '$' to the method?
            C2D2Context.prototype[m] = (function (method) {return function () {
                method.apply(this, arguments);
                return this;
            };}(method));
        }
    }
};


// Unlike addMethods, requires manually supplying 'this' at the end
C2D2Context.extend = function (obj) { // Keeps constructor property in tact
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            C2D2Context.prototype[p] = obj[p];
        }
    }
};

function _forEach (arr, h) {
    for (var i = 0, arrl = arr.length; i < arrl; i++) {
        h(arr[i], i);
    }
}

function _arrayify (begin) {
    var args = arguments;
    if (typeof begin === 'string') {
        args = [];
        var coords = begin.replace(/^\s*(.*?)\s*$/, '$1').replace(/\s*,\s+/g, ',').split(/\s+/);

        _forEach(coords, function (item, idx) {
            args[idx] = item.split(',');
        });
    }
    return args;
}

// EXTENSIONS
C2D2Context.addMethods({
    $line: function (obj) {
        var a;
        if (obj && typeof obj === 'object' && !obj.length) {
            if (obj.color) {
                this.$lineColor(obj.color);
            }
            if (obj.width || obj.w) {
                this.lineWidth(obj.width || obj.w);
            }
            if (obj.shadow || obj.$shadow) {
                this.$shadow(obj.shadow);
            }
            a = _arrayify.apply(null, (obj.coords || obj.xy || obj.path));
        }
        else {
            a = _arrayify.apply(null, arguments);
        }
        this.beginPath().moveTo.apply(this, a[0]);
        for (var i=1, argl = a.length; i < argl; i++) {
            this.lineTo.apply(this, a[i]);
        }
        this.stroke();
    },
    $fill: function (obj) {
        var a;
        if (obj && typeof obj === 'object' && !obj.length) {
            if (obj.color) {
                this.$fillColor(obj.color);
            }
            if (obj.shadow || obj.$shadow) {
                this.$shadow(obj.shadow);
            }
            a = _arrayify.apply(null, (obj.coords || obj.xy || obj.path));
        }
        else {
            a = _arrayify.apply(null, arguments);
        }
        this.beginPath().moveTo.apply(this, a[0]);
        for (var i=1, argl=a.length; i < argl; i++) {
            this.lineTo.apply(this, a[i]);
        }
        this.fill();
    },
    $clear: function (x, y, w, h) {
        this.$clearRect(x, y, w, h);
    },
    $fillRect : function (x, y, w, h) {
        x = x || 0;
        y = y || 0;
        w = w || this.width;
        h = h || this.height;
        if (x && typeof x === 'object' && x.length) {
            this.fillRect.apply(this, x); // Allow array for coordinates
        }
        this.fillRect(x, y, w, h);
    },
    $clearRect : function (x, y, w, h) {
        x = x || 0;
        y = y || 0;
        w = w || this.width;
        h = h || this.height;
        if (x && typeof x === 'object' && x.length) {
            this.clearRect.apply(this, x); // Allow array for coordinates
        }
        this.clearRect(x, y, w, h);
    },
    $strokeRect : function (x, y, w, h) {
        x = x || 0;
        y = y || 0;
        w = w || this.width;
        h = h || this.height;
        if (x && typeof x === 'object' && x.length) {
            this.strokeRect.apply(this, x); // Allow array for coordinates
        }
        this.strokeRect(x, y, w, h);
    }
});
C2D2Context.extend({ // Don't auto-return 'this' object for these
    $shadowColor : function (value) {
        if (value == 'random') {
            value = C2D2Context.randomColor();
        }
        return this.shadowColor(value);
    },
    $fillColor : function (value) { // getter or setter
        if (value == 'random') {
            value = C2D2Context.randomColor();
        }
        return this.fillStyle(value);
    },
    $lineColor : function (value) { // getter or setter
        if (value == 'random') {
            value = C2D2Context.randomColor();
        }
        return this.strokeStyle(value);
    },
    $imageData : function () {
        var args = arguments;
        if (typeof args[0] === 'object' && typeof args[1] !== 'undefined') {
            this.putImageData.apply(this, args);
            return this;
        }
        if (typeof args[2] !== 'undefined') {
            return this.getImageData.apply(this, args); // data (length), width, height
        }
        return this.createImageData.apply(this, args);
    },
    $shadowOffset: function (x, y) {
        if (typeof x === 'undefined') {
            return [this.shadowOffsetX(), this.shadowOffsetY()];
        }

        if (typeof x === 'object' && !y && x.length) {
            y = x[1], x = x[0];
        }
        else if (typeof x === 'string' && x.indexOf(',') !== -1) {
            var xy = x.split(/\s*,\s*/);
            x = xy[0], y = xy[1];
        }
        this.shadowOffsetX(x).shadowOffsetY(y);
        return this;
    },
    $shadowBlur : function () { // Just a place-holder, at least for now
        this.shadowBlur.apply(this, arguments);
    },
    $shadowOffsetY : function () { // Just a place-holder, at least for now
        this.shadowOffsetY.apply(this, arguments);
    },
    $shadowOffsetX : function () { // Just a place-holder, at least for now
        this.shadowOffsetX.apply(this, arguments);
    },
    $shadow: function (sh) {
        if (typeof sh === 'undefined') { // Not super useful compared to native
            return {offset: this.$shadowOffset(), blur : this.shadowBlur(), color: this.$shadowColor(),
                           offsetX: this.shadowOffsetX(), offsetY: this.shadowOffsetY()};
        }
        for (var att in sh) {
            if (sh.hasOwnProperty(att)) {
                if (att === 'offset') { // Offer additional property to get the coords together
                    this.$shadowOffset.call(this, sh[att]);
                }
                else {
                    this['$shadow' + att.charAt(0).toUpperCase() + att.slice(1)](sh[att]);
                }
            }
        }
        return this;
    }
});


C2D2Context.randomNumber = function (min, max) {
    min = min || 0;
    max = max || 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// See also the individual methods which use this (allowing "random" as a "color" argument)
C2D2Context.randomColor = function (r, g, b, rmax, gmax, bmax) {
    r = r || 0;
    g = g || 0;
    b = b || 0;
    rmax = rmax || 255;
    gmax = gmax || 255;
    bmax = bmax || 255;
    var red = C2D2Context.randomNumber(r, rmax);
    var green = C2D2Context.randomNumber(g, gmax);
    var blue = C2D2Context.randomNumber(b, bmax);
    return 'rgb('+red+','+green+','+blue+')';
};
// Useful for separation of concerns, detecting the CSS style rule for a given class, id, or other selector and applying it as an argument to a canvas method,
// so that the JavaScript does not need to be concerned with secondary styling (of course the images it generates is a kind of style)
C2D2Context.getCSSPropertyValue = function (selectorText, propertyName, sheet) {
    var i = 0, j = 0, dsl = 0, crl = 0, ss,
        _getPropertyFromStyleSheet =
            function (ss, selectorText, propertyName) {
                var rules = ss.cssRules ? ss.cssRules : ss.rules; /* Mozilla or IE */
                for (j = 0, crl = rules.length; j < crl; j++) {
                    var rule = rules[j];
                    try {
                        if (rule.type === CSSRule.STYLE_RULE && rule.selectorText === selectorText) {
                            return rule.style.getPropertyValue(propertyName);
                        }
                    }
                    catch (err) { /* IE */
                        if (rule.selectorText === selectorText) {
                            propertyName = propertyName.replace(/-([a-z])/g, function (str, n1) {
                                return n1.toUpperCase();
                            });
                            return rule.style[propertyName];
                        }
                    }
                }
                return false;
            };
    if (typeof sheet !== 'undefined') {
        ss = document.styleSheets[sheet];
        return _getPropertyFromStyleSheet(ss, selectorText, propertyName);
    }
	var value;
    for (i = 0, dsl = document.styleSheets.length; i < dsl; i++) {
        ss = document.styleSheets[i];
        value = _getPropertyFromStyleSheet(ss, selectorText, propertyName);
        if (value) {
            break;
        }
    }
    return value;
};

/*
Exports the following as globals (though only "Canvas2d" is really needed);
    the name of the class to create may be altered here
*/
}('Canvas2d', 'CanvasElement', 'C2D2ImageData', 'C2D2Gradient', 'C2D2Pattern', 'C2D2CanvasPixelArray'));
