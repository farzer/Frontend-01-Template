module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-used-variable': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': 0,
  },
  settings: {
    createClass: 'createReactElement',
    pragma: 'create',
  },
};
