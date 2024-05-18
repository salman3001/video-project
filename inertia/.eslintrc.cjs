module.exports = {
  parser: 'vue-eslint-parser', // Use the Vue parser
  parserOptions: {
    parser: '@typescript-eslint/parser', // Use the TypeScript parser for script blocks
    ecmaVersion: 2020, // Set ECMAScript version
    sourceType: 'module',
    extraFileExtensions: ['.vue'], // Recognize .vue files
  },
  extends: [
    'plugin:vue/vue3-recommended', // For Vue 3; for Vue 2, use 'plugin:vue/recommended'
    // 'plugin:@typescript-eslint/recommended', // TypeScript rules
    'prettier',
  ],
  rules: {
    'unicorn/filename-case': 'off', // Turn off the unicorn/filename-case rule for all files
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/naming-convention': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/valid-v-slot': 'off',
    'vue/html-indent': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
  },
}
