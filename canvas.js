(function () {

function _Canvas2dSetup () {
    var i, gmethl, methl, propl;
    // Predefined methods
    var methods = ['arc','arcTo','beginPath','bezierCurveTo','clearRect',
        'clip','closePath','drawImage','fill','fillRect','fillText','lineTo','moveTo',
        'quadraticCurveTo','rect','restore','rotate','save','scale','setTransform',
        'stroke','strokeRect','strokeText','transform','translate']; // drawFocusRing not currently supported

    // Do not return 'this' object since purpose is to get (and the objects they create don't have more than
    // one method to make it desirable to chain, except for ImageData ones, moved to childGetterMethods

    // Fix: createPattern is a wholly opaque object, so might need to have child wrappers
    //    if implementing any known methods in the future

    // Fix: Implement these to be wrapped so can get and set data in their own child chains
    var childGetterMethods = ['createImageData','createLinearGradient',
        'createRadialGradient', 'getImageData','putImageData'];
    var getterMethods = ['createPattern','drawFocusRing','isPointInPath','measureText'].concat(childGetterMethods);

    // Predefined properties
    var props = ['canvas','fillStyle','font','globalAlpha','globalCompositeOperation',
        'lineCap','lineJoin','lineWidth','miterLimit','shadowOffsetX','shadowOffsetY',
        'shadowBlur','shadowColor','strokeStyle','textAlign','textBaseline'];

    for (i = 0, methl = methods.length; i < methl; i++) {
        var m = methods[i];
        Canvas2d.prototype[m] = (function (m) {return function () {
            this.ctx[m].apply(this.ctx, arguments);
            return this;
        };}(m));
    }

    for (i = 0, gmethl = getterMethods.length; i < gmethl; i++) {
        var gm = getterMethods[i];
        Canvas2d.prototype[gm] = (function (gm) {return function () {
            return this.ctx[gm].apply(this.ctx, arguments);
        };}(gm));
    }

    for (i = 0, propl = props.length; i < propl; i++) {
        var p = props[i];
        Canvas2d.prototype[p] = (function (p) {return function (value) {
            if (typeof value === 'undefined') {
                return this.ctx[p];
            }
            this.ctx[p] = value;
            return this;
        };}(p));
    }
}

function CanvasElement (arr, opts) {
    var d = document, el = opts, parent;
    var noArray = typeof arr !== 'object' || !arr.length;
    if (noArray) {
        opts = arr;
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
        if (opts.width) {
            el.setAttribute('width', opts.width);
        }
        if (opts.height) {
            el.setAttribute('height', opts.height);
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
    return el;
}

// Could make generic CanvasContext to accept "type" as a property when not '2d'

function Canvas2d (arr, opts) {
    if (!(this instanceof Canvas2d)) {
        return new Canvas2d(arr, opts);
    }
    var d = document,
        el = this.el = this.canvas = CanvasElement(arr, opts);
    this.context = this.ctx = el.getContext('2d');
    if (!Canvas2d.prototype.arc) {
        _Canvas2dSetup(this.ctx);
    }
    // Expose the CanvasElement properties
    this.width = this.el.width;
    this.height = this.el.height;
    return this; // Satisfy Netbeans
}
// Expose the CanvasElement methods
Canvas2d.prototype.getContext = function () {
    return this.el.getContext.apply(this.el, arguments);
};
Canvas2d.prototype.toDataURL = function () {
    return this.el.toDataURL.apply(this.el, arguments);
};


Canvas2d.addMethods = function (methodMap) {
    for (var m in methodMap) {
        if (methodMap.hasOwnProperty(m)) {
            var method = methodMap[m]; // Fix: Automate adding of '$' to the method?
            Canvas2d.prototype[m] = (function (method) {return function () {
                method.apply(this, arguments);
                return this;
            };}(method));
        }
    }
};


// Unlike addMethods, requires manually supplying 'this' at the end
Canvas2d.extend = function (obj) { // Keeps constructor property in tact
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            Canvas2d.prototype[p] = obj[p];
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
Canvas2d.addMethods({
    $line: function (obj) {
        var a;
        if (obj && typeof obj === 'object' && !obj.length) {
            if (obj.color) {
                this.$lineColor(obj.color);
            }
            if (obj.width) {
                this.lineWidth(obj.width);
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
        this.closePath().stroke();
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
            var a = _arrayify.apply(null, arguments);
        }
        this.beginPath().moveTo.apply(this, a[0]);
        for (var i=1, argl=a.length; i < argl; i++) {
            this.lineTo.apply(this, a[i]);
        }
        this.fill();
    },
    $clear: function (a, b, c, d) {
        a = a || 0;
        b = b || 0;
        c = c || this.width;
        d = d || this.height;
        this.clearRect(a, b, c, d);
    }
});
Canvas2d.extend({ // Don't auto-return 'this' object for these
    $shadowColor : function (value) {
        if (value == 'random') {
            value = Canvas2d.randomColor();
        }
        return this.shadowColor(value);
    },
    $fillColor : function (value) { // getter or setter
        if (value == 'random') {
            value = Canvas2d.randomColor();
        }
        return this.fillStyle(value);
    },
    $lineColor : function (value) { // getter or setter
        if (value == 'random') {
            value = Canvas2d.randomColor();
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


Canvas2d.randomNumber = function (min, max) {
    min = min || 0;
    max = max || 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// See also the individual methods which use this (allowing "random" as a "color" argument)
Canvas2d.randomColor = function (r, g, b, rmax, gmax, bmax) {
    r = r || 0;
    g = g || 0;
    b = b || 0;
    rmax = rmax || 255;
    gmax = gmax || 255;
    bmax = bmax || 255;
    var red = Canvas2d.randomNumber(r, rmax);
    var green = Canvas2d.randomNumber(g, gmax);
    var blue = Canvas2d.randomNumber(b, bmax);
    return 'rgb('+red+','+green+','+blue+')';
};
// Useful for separation of concerns, detecting the CSS style rule for a given class, id, or other selector and applying it as an argument to a canvas method,
// so that the JavaScript does not need to be concerned with secondary styling (of course the images it generates is a kind of style)
Canvas2d.getCSSPropertyValue = function (selectorText, propertyName, sheet) {
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



// EXPORTS
this.Canvas2d = Canvas2d;
this.CanvasElement = CanvasElement; // Only needed externally for those who wish to insist
                                                                            // on a distinction between the element and the context
}());
