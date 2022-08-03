## Package.json
Commit: <type> : <msg>

Type List: 
 * build
 * ci
 * chore
 * docs
 * feat
 * fix
 * perf
 * refactor
 * revert
 * style
 * test

### devDependencies

    * typescript
        * typescript: TypeScript Transpiler
        * @types/node: TypeScript definitions for Node.js
        * ts-node: TypeScript를 바로 Node에서 실행

    * jest/chai
        * @types/jest: Jest types
        * ts-jest: TypeScript를 Jest에 적용
        * @testdeck/jest: Class Decorator를 Jest에 적용
        * chai: Jest에서 사용할 Assertion/Expectation Frameworks
        * @types/chai: Chai types

    * eslint/prettier
        * @typescript-eslint/parser: [eslint] Typescript 구문 분석을 위해 사용
        * @typescript-eslint/eslint-plugin: [eslint] TypeScript를 ESLint로 적용
        * eslint-config-prettier: [eslint+prettier] prettier와 충돌할 수 있는 ESLint 규칙을 비활성화
        * eslint-plugin-prettier: [eslint+prettier] prettier와 규칙을 ESLint 규칙으로 추가시킵니다. prettier와 모든 규칙이 ESLint로 들어오기 때문에 ESLint만 실행하면 됩니다.
        * prettier: [prettier] 코드를 일정한 규칙에 맞게
        * prettier-eslint: [eslint+prettier] prettier와 eslint를 연결

    * lerna
        * lerna: mono repo
