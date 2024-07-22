export default [
  {
    extends: ['eslint:recommended', 'plugin:node/recommended'],
    parserOptions: {
      ecmaVersion: 2016,
      sourceType: 'module',
      ecmaFeatures: {
        experimentalObjectRestSpread: true
      }
    },
    parser: '@babel/eslint-parser',
    env: {
      node: true
    },
    rules: {
      'no-console': 'off'
    }
  }
];
