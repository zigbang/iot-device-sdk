module.exports = {
    // ESLint는 구문 분석을 위해 기본적으로 Espree 파서를 사용합니다.
    // Typescript 구문 분석을 위해 사용되는 @typescript-eslint/parser를 넣어줬습니다.
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.eslint.json',
        //ecmaVersion: 6,
        sourceType: 'module',
    },
    env: {
        // browser: true, // Browser환경을 위한다면 활성화
        node: true, // Node.js환경을 위한다면 활성화
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // eslint-plugin-prettier + eslint-config-prettier 동시 적용
    ],
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    }
}
