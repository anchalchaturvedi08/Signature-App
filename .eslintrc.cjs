module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    plugins: ['html'],
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: { ecmaVersion: 12, sourceType: 'module' },
    rules: {
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
    },
    overrides: [
        {
            files: ["**/__tests__/*.js"],
            env: {
                jest: true
            }
        }
    ]
};
