'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-node-overrides'],
  env: {
    node: true,
    browser: true
  },
  settings: {
    polyfills: [
      'Object.entries'
    ]
  },
  overrides: [
    {
      files: ['*.md/*.js'],
      globals: {
        require: false,
        c2d2: true
      },
      rules: {
        'import/unambiguous': 0,
        'import/no-commonjs': 0,
        'n/no-missing-require': ['error', {allowModules: ['c2d2']}],
        'no-unused-vars': ['error', {varsIgnorePattern: 'c2d2'}],
        'no-shadow': ['error', {allow: ['c2d2']}]
      }
    },
    {
      files: ['*.html'],
      rules: {
        'import/unambiguous': 0
      }
    }
  ],
  rules: {
    // Disable for now
    'jsdoc/require-jsdoc': 0
  }
};
