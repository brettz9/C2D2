import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'explorercanvas',
      'dist'
    ]
  },
  ...ashNazg(['sauron', 'node', 'browser']),
  {
    files: ['*.md/*.js'],
    languageOptions: {
      globals: {
        require: false,
        c2d2: true
      }
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
    rules: {
      // Disable for now
      'jsdoc/require-jsdoc': 0
    }
  }
];
