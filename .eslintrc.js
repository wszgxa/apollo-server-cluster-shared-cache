module.exports =  {
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  "plugins": ["jest"],
  rules:  {
    "@typescript-eslint/indent": ["error", 2],
    '@typescript-eslint/member-delimiter-style': ['error', {
      "multiline": {
        "delimiter": "none",
        "requireLast": false
      },
      "singleline": {
          "delimiter": "comma",
          "requireLast": false
        }
      }],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "no-console": "error",
    "no-trailing-spaces": "error",
    "jest/valid-expect": "error"
  },
  "env": {
    "jest/globals": true
  }
};
