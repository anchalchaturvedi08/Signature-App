module.exports = {
    env: { browser: true, es2021: true },
    plugins: ['html'],
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: { ecmaVersion: 12, sourceType: 'module' },
    rules: {}
};
