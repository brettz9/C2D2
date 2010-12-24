CD2D
====
C2D2 (See 2D Too) is a light-weight wrapper for HTML5 Canvas, providing jQuery-style chaining in a light package.

Current Status
--------------
All HTML5 Canvas (2D Context) methods and properties are wrapped, as is the Canvas element itself, and convenient 
(and I daresay more intuitively named) wrapper methods are also available, with the character '$' preceding the method 
names in such cases (e.g., $line wraps lineTo).

There are also some static class methods, Canvas2d.randomNumber, Canvas2d.randomColor, and Canvas2d.getCSSPropertyValue,
with the latter used for separation of concerns, allowing convenient detection of CSS style rules specified in
stylesheets and applying them as arguments to canvas methods.

I am quite new to canvas, and this is definitely a work in progress, but since I saw no other low-level canvas 
libraries out there (i.e., lower level than say building charts and specific objects), I thought I'd make this 
one available. This was most recently motivated by nostalgia for the simplicity of HIRES and LORES Apple Basic
commands and the fun experimentation with randomizing colors, and by the chaining popularized by jQuery.


Possible Future Work
--------------------
Wrap up some of the child objects of ImageData and LinearGradients, so that these can be wrapped and made chainable.