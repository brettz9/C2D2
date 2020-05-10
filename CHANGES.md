# C2D2 CHANGES

## 0.8.0

- Build: Update per latest Babel/Rollup
- Build: Use "json" extension with Babel RC
- Linting: As per latest ash-nazg; check rc file
- npm: Replace deprecated rollup-plugin-babel with rollup/plugin-babel
    and make `babelHelpers` use explicit
- npm: Update devDeps.

## 0.7.0

- Breaking change: Remove `innerHTML` option as can trigger security
  concerns; if needed, should set on element before passing in.
- Breaking change: Change dep. core-js-bundle to a devDep.
- npm: Fix and add to ignore file
- npm: Update devDeps. (and add new required peerDeps)

## 0.6.0

- Breaking change: Require Node >= 8
- Breaking change: Now requires polyfills for `Node.append`,
  `document.querySelector`, etc.
- Fix: Return `this` consistently (and explicitly)
- Linting (ESLint): Apply ash-nazg/sauron-node; ignore `node_modules`;
    change rc file extension to a recommended one; lint HTML, Markdown
- Maintenance: Add `.editorconfig`
- Testing: Change test placeholder directory to `test`
- npm: Add rollup to ignore file
- npm: Update devDeps

## 0.5.0

- Breaking change: Switch from now-deprecated `@babel/polyfill` to
    `core-js-bundle` dep.; upgrade canvas dep.
- npm: Switch from `opn-cli` to `open-cli`
- npm: Update devDeps

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
