import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    rootDir: '.',
    preset: 'ts-jest',
    testMatch: ['<rootDir>/test/**/*test.ts'],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
};

export default config;
