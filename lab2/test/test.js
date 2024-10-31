import Matrix from '../src/Matrix.js';
import { expect } from 'chai';

describe('Matrix creation', () => {
    it('No arguments given. Creates an empty 1 x 1 matrix', () => {
        let matrix = new Matrix();
        expect(matrix._size).to.deep.equal([0]);
        expect(matrix._data).to.deep.equal([]);
    })
});