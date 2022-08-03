import { suite, test } from '@testdeck/jest';
import { expect } from 'chai';
import * as strlib from '../src/strlib';

@suite
export class StrLibTest {
    @test
    testStrconcat() {
        const str = strlib.strconcat('a', 'b', 'c');
        expect(str).to.equal('abc');
    }
}
