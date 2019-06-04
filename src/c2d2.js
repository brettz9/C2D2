/* eslint-env node */

/**
* @todo Switch to ES6 modules and build to `dist` with Rollup
* @todo Resume ensuring properties/methods are added and any todos noted for potential to accept specific arguments as wrapped objects or return wrapped items: {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dfnReturnLink-0}
* @todo add with package.json (including Node dependencies) to npm
* @todo Add tests, including for window, Node, AMD
* @todo Add shim plugin dependency once ready
*/

function _forEach (arr, h) {
    for (let i = 0, arrl = arr.length; i < arrl; i++) {
        h(arr[i], i);
    }
}

function _arrayify (begin) {
    let args = arguments;
    if (typeof begin === 'string') {
        args = [];
        const coords = begin.trim().replace(/\s*,\s+/g, ', ').split(/\s+/);

        _forEach(coords, (item, idx) => {
            args[idx] = item.split(', ');
        });
    }
    return args;
}

// Adds NodeJS support, and exports interface to modules that require this module
const w = typeof window === 'undefined' ? global : window; // This should not be needed by Node

function buildMethod (m) {
    return function (...args) {
        this.parent[m](...args);
        return this;
    };
}
function buildGetterMethod (gm, methodFromProperty, WrapperClass) {
    return function (imageData) {
        const args = [].slice.call(arguments);
        if (gm === 'putImageData' && typeof imageData === 'object' && imageData.imageData) { // Todo: Hackish check for taking regular ImageData object
            args[0] = imageData.imageData;
        }
        if (methodFromProperty) {
            return new WrapperClass(this.parent[gm]);
        }
        return new WrapperClass(this.parent[gm](...args));
    };
}
function buildLiteralGetterMethod (gm) {
    return function (...args) {
        return this.parent[gm](...args);
    };
}
function buildPropertyMethod (p) {
    return function (value) {
        if (value === undefined) {
            return this.parent[p];
        }
        this.parent[p] = value;
        return this;
    };
}
function buildContextMethods (method) {
    return function (...args) {
        method.apply(this, args);
        return this;
    };
}
// Todo: Wrap up any specific methods or properties which might be used on the opaque pattern and
//     gradient child objects, if ever exposed, so that these can be properly wrapped and made chainable.
const DelegateChain = {
    addMethods (methods, clss) {
        for (let i = 0, methl = methods.length; i < methl; i++) {
            const m = methods[i];
            clss.prototype[m] = buildMethod(m);
        }
    },
    addGetterMethods (getterMethods, clss, WrapperClass, methodFromProperty) {
        for (let i = 0, gmethl = getterMethods.length; i < gmethl; i++) {
            const gm = getterMethods[i];
            if (WrapperClass) {
                clss.prototype[gm] = buildGetterMethod(gm, methodFromProperty, WrapperClass);
            } else { // For those which return a literal
                clss.prototype[gm] = buildLiteralGetterMethod(gm);
            }
        }
    },
    addPropertyMethods (props, clss) {
        for (let i = 0, propl = props.length; i < propl; i++) {
            const p = props[i];
            clss.prototype[p] = buildPropertyMethod(p);
        }
    }
};

function _C2D2CanvasPixelArraySetup () {
    const props = ['length']; // We'll just use this commonly used accessor name
    C2D2CanvasPixelArray.prototype.item = function (value, value2) {
        if (value2 === undefined) {
            return this.parent[value];
        }
        this.parent[value] = value2;
        return this;
    };
    //  even though not part of standard interface (not specified)
    DelegateChain.addPropertyMethods(props, C2D2CanvasPixelArray);
}

function C2D2CanvasPixelArray (canvasPixelArrayObj) {
    if (!C2D2CanvasPixelArray.prototype.length) {
        _C2D2CanvasPixelArraySetup();
    }
    this.parent = this.array = this.pixelArray = canvasPixelArrayObj;
};

function _C2D2ImageDataSetup () {
    const props = [
            'width', 'height', 'resolution' // Todo: The latter is read-only
        ],
        getterMethods = ['data'];
    DelegateChain.addGetterMethods(getterMethods, C2D2ImageData, C2D2CanvasPixelArray, true);
    DelegateChain.addPropertyMethods(props, C2D2ImageData);
}

function C2D2ImageData (imageDataObj) {
    if (!C2D2ImageData.prototype.width) {
        _C2D2ImageDataSetup();
    }
    this.parent = this.imageData = imageDataObj;
};

function _C2D2GradientSetup () {
    const methods = ['addColorStop'];
    DelegateChain.addMethods(methods, C2D2Gradient);
}

// Partly opaque
function C2D2Gradient (gradientObj) {
    if (!C2D2Gradient.prototype.addColorStop) {
        _C2D2GradientSetup();
    }
    this.parent = this.gradient = gradientObj;
}

// function _C2D2PatternSetup () {
//      Fully opaque
// }

// Fully opaque
// If never any benefits to wrapping (with chainable new methods), just avoid making this child class
function C2D2Pattern (patternObj) {
    // if (!C2D2Pattern.prototype.width) { // no known properties/methods
    //    _C2D2PatternSetup();
    // }
    this.parent = this.pattern = patternObj;
    return patternObj; // Just return the object for now, as appears there will be no need to wrap
}

function _C2D2ContextSetup () {
    // Predefined methods
    const methods = [
        'addHitRegion', 'arc', 'arcTo', 'beginPath', 'bezierCurveTo', 'clearRect',
        'clip', 'closePath', 'commit', 'drawImage', 'drawSystemFocusRing', 'ellipse', 'fill', 'fillRect', 'fillText', 'getLineDash',
        'lineTo', 'moveTo', 'quadraticCurveTo', 'rect', 'removeHitRegion', 'resetClip', 'resetTransform',
        'restore', 'rotate', 'save', 'scale', 'scrollPathIntoView', 'setLineDash', 'setTransform',
        'stroke', 'strokeRect', 'strokeText', 'transform', 'translate'
    ]; // drawFocusRing not currently supported
    // Todo: Implement these to be wrapped so can get and set data in their own child chains
    // Todo: createPattern is a wholly opaque object, so might need to have child wrappers
    //    if implementing any known methods in the future
    const imageDataGetterMethods = ['createImageData', 'createImageDataHD', 'getImageData', 'getImageDataHD', 'putImageData', 'putImageDataHD'],
        gradientGetterMethods = ['createLinearGradient', 'createRadialGradient'],
        patternGetterMethods = ['createPattern'], // Todo: createPattern to accept wrapped canvas element or context?
        // Do not return 'this' object since purpose is to get (and the objects they create don't have more than
        // one method to make it desirable to chain, except for ImageData ones, moved to childGetterMethods
        getterMethods = ['drawCustomFocusRing', 'isPointInPath', 'isPointInStroke', 'measureText']; // wrap TextMetrics of measureText?
        // Predefined properties
    const props = ['canvas', 'currentTransform', 'direction', 'fillStyle', 'font', 'globalAlpha',
        'globalCompositeOperation', 'imageSmoothingEnabled',
        'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth', 'miterLimit',
        'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor',
        'strokeStyle', 'textAlign', 'textBaseline']; // Todo: fillStyle and strokeStyle to return or be settable with wrapped CanvasGradient or CanvasPattern, currentTransform with wrapped SVGMatrix?

    DelegateChain.addMethods(methods, C2D2Context);

    DelegateChain.addGetterMethods(imageDataGetterMethods, C2D2Context, C2D2ImageData);
    DelegateChain.addGetterMethods(gradientGetterMethods, C2D2Context, C2D2Gradient);
    DelegateChain.addGetterMethods(patternGetterMethods, C2D2Context, C2D2Pattern);

    DelegateChain.addGetterMethods(getterMethods, C2D2Context);

    DelegateChain.addPropertyMethods(props, C2D2Context);
}

function c2d2Element (arr, opts) {
    let el = opts;
    const d = w.document || null;
    const noArray = typeof arr !== 'object' || !arr.length;

    if (noArray) {
        el = opts = arr;
        arr = [];
    } else {
        opts = opts || {};
    }
    const bNodeModule = opts && (opts.path || opts.fileStream);

    let parent;
    // Todo: deal with string w/h coords, number w/h coords
    if (typeof opts === 'string') {
        el = d.getElementById(opts);
    } else if (typeof opts === 'object' && bNodeModule) {
        const {createCanvas} = require('canvas');
        el = createCanvas();
        const width = arr[0] || opts.width || opts.w;
        const height = arr[1] || opts.height || opts.h;
        if (width) {
            el.width = width;
        }
        if (height) {
            el.height = height;
        }
        const path = opts.fileStream || opts.path;
        if (path) {
            const fs = require('fs');
            const out = fs.createWriteStream(path);
            const stream = el.createPNGStream();
            stream.on('data', (chunk) => {
                out.write(chunk);
            });
            stream.on('end', () => {
                out.end();
            });
        }
    } else if (typeof opts === 'object' && !opts.nodeName) {
        el = (d.createElementNS && d.documentElement.namespaceURI !== null)
            ? d.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
            : d.createElement('canvas');
        if (opts.width || opts.w) {
            el.setAttribute('width', opts.width || opts.w);
        }
        if (opts.height || opts.h) {
            el.setAttribute('height', opts.height || opts.h);
        }
        if (opts.id) {
            el.setAttribute('id', opts.id);
        }
        if (opts.style) { // Better to use a class instead
            el.setAttribute('style', opts.style);
        }
        if (opts.innerHTML) { // For fallback display
            el.innerHTML = opts.innerHTML;
        }
        if (opts['class'] || opts.className) {
            el.setAttribute('class', opts['class'] || opts.className);
        }
        parent = opts.appendTo
            ? typeof opts.appendTo === 'string'
                ? d.getElementById(opts.appendTo)
                : opts.appendTo
            : d.body;
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

    if (w.G_vmlCanvasManager) { // If using ExplorerCanvas to get IE support: http://code.google.com/p/explorercanvas/
        el = w.G_vmlCanvasManager.initElement(el);
    }
    return el;
};

/**
* Wraps CanvasRenderingContext2D
* @todo Could make generic CanvasContext to accept "type" as a property when not '2d'
*/
function C2D2Context (arr, opts) {
    if (!(this instanceof C2D2Context)) {
        return new C2D2Context(arr, opts);
    }

    const el = this.canvas = c2d2Element(arr, opts);

    this.context = this.parent = el.getContext('2d');
    if (!C2D2Context.prototype.arc) {
        _C2D2ContextSetup();
    }
    // Expose the c2d2Element properties (todo: could use Object.defineProperty to ensure stayed in sync)
    this.width = el.width;
    this.height = el.height;
    return this; // Satisfy Netbeans
};
// Expose the c2d2Element methods
_forEach(['transferControlToProxy', // Todo: Wrap this method's CanvasProxy return result?
    'getContext', 'probablySupportsContext', 'supportsContext', 'setContext',
    'toDataURL', 'toDataURLHD', 'toBlob', 'toBlobHD'], function (method) {
    C2D2Context.prototype[method] = function (...args) {
        return this.canvas[method](...args);
    };
});

C2D2Context.addMethods = function (methodMap) {
    Object.entries(methodMap).forEach(([methodName, method]) => {
        C2D2Context.prototype[methodName] = buildContextMethods(method);
    });
};

// Unlike addMethods, requires manually supplying 'this' at the end
C2D2Context.extend = function (obj) { // Keeps constructor property in tact
    Object.entries(obj).forEach(([propertyName, propertyValue]) => {
        C2D2Context.prototype[propertyName] = propertyValue;
    });
};

// EXTENSIONS
C2D2Context.addMethods({
    $line (obj, close) {
        let a;
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
        } else {
            a = _arrayify.apply(null, arguments);
        }
        this.beginPath().moveTo.apply(this, a[0]);
        for (let i = 1, argl = a.length; i < argl; i++) {
            this.lineTo(...a[i]);
        }
        if (close || obj.close) {
            this.closePath();
        }
        this.stroke();
    },
    $fill (obj) {
        let a;
        if (obj && typeof obj === 'object' && !obj.length) {
            if (obj.color) {
                this.$fillColor(obj.color);
            }
            if (obj.shadow || obj.$shadow) {
                this.$shadow(obj.shadow);
            }
            a = _arrayify.apply(null, (obj.coords || obj.xy || obj.path));
        } else {
            a = _arrayify.apply(null, arguments);
        }
        if (a[0].length === 4) {
            return this.$fillRect(...a);
        }
        this.beginPath().moveTo.apply(this, a[0]);
        for (let i = 1, argl = a.length; i < argl; i++) {
            this.lineTo(...a[i]);
        }
        this.fill();
    },
    $clear (...args) {
        this.$clearRect(...args);
    },
    $fillRect (x, y, w, h) {
        if (x && typeof x === 'object' && x.length) {
            for (let i = 0, argl = arguments.length; i < argl; i++) {
                this.$fillRect(...arguments[i]); // Allow array for coordinates
            }
            return this;
        }
        this.fillRect(x || 0, y || 0, w || this.width, h || this.height);
    },
    $clearRect (x, y, w, h) {
        if (x && typeof x === 'object' && x.length) {
            for (let i = 0, argl = arguments.length; i < argl; i++) {
                this.$clearRect(...arguments[i]); // Allow array for coordinates
            }
            return this;
        }
        this.clearRect(x || 0, y || 0, w || this.width, h || this.height);
    },

    // $rect, $clip, $arcTo

    $strokeRect (x, y, w, h) {
        if (x && typeof x === 'object' && x.length) {
            for (let i = 0, argl = arguments.length; i < argl; i++) {
                this.$strokeRect(...arguments[i]); // Allow array for coordinates
            }
            return this;
        }
        this.strokeRect(x || 0, y || 0, w || this.width, h || this.height);
    },
    $arc (x, y, radius, startAngle, endAngle, anticlockwise) {
        if (x && typeof x === 'object' && x.length) {
            for (let i = 0, argl = arguments.length; i < argl; i++) {
                this.$arc(...arguments[i]); // Allow array for coordinates
            }
            return this;
        }
        this.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    },
    $quadraticCurve (...args) {
        this.$quadratic(...args);
    },
    $quadraticCurveTo (...args) {
        this.$quadratic(...args);
    },
    $quadratic (cp1x, cp1y, x, y) {
        if (cp1x && typeof cp1x === 'object' && cp1x.length) {
            for (let i = 0, argl = arguments.length; i < argl; i++) {
                this.$quadratic(...arguments[i]); // Allow array for coordinates
            }
            return this;
        }
        this.quadraticCurveTo(cp1x, cp1y, x, y);
    },
    $bezierCurve (...args) {
        this.$bezier(...args);
    },
    $bezierCurveTo (...args) {
        this.$bezier(...args);
    },
    $bezier (cp1x, cp1y, cp2x, cp2y, x, y) {
        if (cp1x && typeof cp1x === 'object' && cp1x.length) {
            for (let i = 0, argl = arguments.length; i < argl; i++) {
                this.$bezier(...arguments[i]); // Allow array for coordinates
            }
            return this;
        }
        this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }
});
C2D2Context.extend({ // Don't auto-return 'this' object for these
    $shadowColor (value) {
        if (value === 'random') {
            value = C2D2Context.randomColor();
        }
        return this.shadowColor(value);
    },
    $fillColor (value) { // getter or setter
        if (value === 'random') {
            value = C2D2Context.randomColor();
        }
        return this.fillStyle(value);
    },
    $lineColor (value) { // getter or setter
        if (value === 'random') {
            value = C2D2Context.randomColor();
        }
        return this.strokeStyle(value);
    },
    $imageData (...args) {
        if (typeof args[0] === 'object' && args[1] !== undefined) {
            this.putImageData(...args);
            return this;
        }
        if (args[2] !== undefined) {
            return this.getImageData(...args); // data (length), width, height
        }
        return this.createImageData(...args);
    },
    $shadowOffset (x, y) {
        if (x === undefined) {
            return [this.shadowOffsetX(), this.shadowOffsetY()];
        }

        if (typeof x === 'object' && !y && x.length) {
            y = x[1];
            x = x[0];
        } else if (typeof x === 'string' && x.indexOf(', ') !== -1) {
            ([x, y] = x.split(/\s*,\s*/));
        }
        this.shadowOffsetX(x).shadowOffsetY(y);
        return this;
    },
    $shadowBlur (...args) { // Just a place-holder, at least for now
        this.shadowBlur(...args);
    },
    $shadowOffsetY (...args) { // Just a place-holder, at least for now
        this.shadowOffsetY(...args);
    },
    $shadowOffsetX (...args) { // Just a place-holder, at least for now
        this.shadowOffsetX(...args);
    },
    $shadow (sh) {
        if (sh === undefined) { // Not super useful compared to native
            return {offset: this.$shadowOffset(), blur: this.shadowBlur(), color: this.$shadowColor(),
                offsetX: this.shadowOffsetX(), offsetY: this.shadowOffsetY()};
        }
        Object.entries(sh).forEach(([att, shadowOffset]) => {
            if (att === 'offset') { // Offer additional property to get the coords together
                this.$shadowOffset(shadowOffset);
            } else {
                this[`$shadow${att.charAt(0).toUpperCase() + att.slice(1)}`](shadowOffset);
            }
        });
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
    const red = C2D2Context.randomNumber(r, rmax),
        green = C2D2Context.randomNumber(g, gmax),
        blue = C2D2Context.randomNumber(b, bmax);
    return `rgb${red}, ${green}, ${blue})`;
};
/**
Useful for separation of concerns, detecting the CSS style rule for a given class, id, or other selector and applying it as an argument to a canvas method, so that the JavaScript does not need to be concerned with secondary styling (of course the images it generates is a kind of style)
*/
C2D2Context.getCSSPropertyValue = function (selectorText, propertyName, sheet) {
    function _getPropertyFromStyleSheet (ss, selectorText, propertyName) {
        const rules = ss.cssRules || ss.rules; // Mozilla or IE
        for (let j = 0, crl = rules.length; j < crl; j++) {
            const rule = rules[j];
            try {
                if (rule.type === 1 && // CSSRule.STYLE_RULE
                    rule.selectorText === selectorText) {
                    return rule.style.getPropertyValue(propertyName);
                }
            } catch (err) { // IE
                if (rule.selectorText === selectorText) {
                    propertyName = propertyName.replace(/-([a-z])/g, String.prototype.toUpperCase);
                    return rule.style[propertyName];
                }
            }
        }
        return false;
    };
    let ss, val;
    if (sheet !== undefined) {
        ss = document.styleSheets[sheet];
        return _getPropertyFromStyleSheet(ss, selectorText, propertyName);
    }
    for (let i = 0, dsl = document.styleSheets.length; i < dsl; i++) {
        ss = document.styleSheets[i];
        val = _getPropertyFromStyleSheet(ss, selectorText, propertyName);
        if (val) {
            break;
        }
    }
    return val;
};

// Attach classes for sake of extensibility (or utilization for canvasElement)
C2D2Context.CanvasPixelArray = C2D2CanvasPixelArray;
C2D2Context.ImageData = C2D2ImageData;
C2D2Context.Gradient = C2D2Gradient;
C2D2Context.Pattern = C2D2Pattern;
C2D2Context.canvasElement = c2d2Element;

export default C2D2Context;
