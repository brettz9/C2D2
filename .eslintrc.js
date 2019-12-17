module.exports = {
  "extends": ["ash-nazg/sauron-node"],
  "parserOptions": {
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "browser": true
  },
  settings: {
    polyfills: [
      'Object.entries'
    ]
  },
  overrides: [
    {
      files: ['*.md'],
      globals: {
        require: false,
        C2D2: true
      },
      rules: {
        'import/unambiguous': 0,
        'import/no-commonjs': 0,
        'no-unused-vars': ['error', {varsIgnorePattern: 'C2D2'}],
        'node/no-missing-require': ['error', {allowModules: ['c2d2']}],
        'no-shadow': ['error', {allow: ['C2D2']}]
      }
    },
    {
      files: ['*.html'],
      rules: {
        'import/unambiguous': 0
      }
    }
  ],
  "rules": {
    // Disable for now
    "jsdoc/require-jsdoc": 0
  }
};
