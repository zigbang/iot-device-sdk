module.exports = {
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    overrides: [
        {
            files: '*.json',
            options: {
                printWidth: 200,
            }
        }
    ]
}
