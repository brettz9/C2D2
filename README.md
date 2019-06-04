# C2D2

C2D2 (See 2D Too) is a light-weight wrapper for HTML5 Canvas,
providing jQuery-style chaining in a light package.

See <http://brettz9.github.com/C2D2/> for examples and further details.

## Installation

`npm install c2d2`

## Usage (browser)

ES6 Modules:

```html
<script type="module">

import C2D2 from 'node_modules/c2d2/dist/c2d2-es.js';

C2D2([1000, 450]).$shadow({color:'green', blur:2, offset:[5, 10]})
    .$line({color:'red', width:5, xy:[[75, 50], [100,75], [100,25]]})
    .$fill({color:'blue', xy:[[175, 150], [200,175], [200,125]]});

</script>
```

For older browsers:

```html
<!--[if lte IE 8]><script src="explorercanvas/excanvas.js"></script><![endif]-->
<script src="node_modules/core-js-bundle/minified.js"></script>
<script src="node_modules/c2d2/dist/c2d2.js"></script>
```

```js
// Available as a global
C2D2([1000, 450]).$shadow({color:'green', blur:2, offset:[5, 10]})
    .$line({color:'red', width:5, xy:[[75, 50], [100,75], [100,25]]})
    .$fill({color:'blue', xy:[[175, 150], [200,175], [200,125]]});
```

## Usage (Node)

```js
const C2D2 = require('c2d2');
```

## To-dos

1. Add tests
1. Document API
1. Pass in `G_vmlCanvasManager` to avoid assuming global (if even needed anymore)?
