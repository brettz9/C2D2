# C2D2 CHANGES

## 0.4.0

- Fix: Point to `dist` for `module`
- Fix: Regression with arguments passed to `C2D2Context.addMethods` (and
    used internally by `$` methods)
- Enhancement: Add `@babel/polyfill` as npm dependency
- Refactoring: Use `Object.entries`
- Demos: Use ES6 Modules in "cleaned" file for easier debugging
- Docs: Indicate `@babel/polyfill` usage

## 0.3.0

- Fix (explorercanvas): Globals (`h`, `s`, `l`) (lgtm)
- Refactoring (explorercanvas): Unused variables/assignments (lgtm)
- Refactoring: Tighter use of const/block scoping; more ES6
- Linting (ESLint): Override new "standard" rule on object-curly-spacing
- Build: Switch from uglify-js to terser for ES minification, update Babel
- Build: Update `dist` files
- npm: Update canvas, devDeps

## 0.2.1

- Node: Ensure `canvas` added as a dependency

## 0.2.0

- Enhancement: Rollup/Babel/Uglify

## 0.1.0

- Initial npm release
