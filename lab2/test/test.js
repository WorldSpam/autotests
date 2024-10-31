import Matrix from '../src/Matrix.js';
import { expect } from 'chai';

describe('Matrix creation', () => {
    it('No arguments given. Creates an empty 1 x 1 matrix', () => {
        let matrix = new Matrix();
        expect(matrix.size).to.deep.equal([0]);
        expect(matrix.data).to.deep.equal([]);
    })
    it('An empty array is given. Creates an empty 1 x 1 matrix', () => {
        let matrix = new Matrix([]);
        expect(matrix.size).to.deep.equal([0]);
        expect(matrix.data).to.deep.equal([]);
    })
    it('An array is given. Creates a matrix from it', () => {
        let matrix = new Matrix([1,2,3]);
        expect(matrix.size).to.deep.equal([3]);
        expect(matrix.data).to.deep.equal([1,2,3]);
    })
    it('A two dimensional array is given. Creates a matrix from it', () => {
        let matrix = new Matrix([[1,2,3],[4,5,6]]);
        expect(matrix.size).to.deep.equal([2,3]);
        expect(matrix.data).to.deep.equal([[1,2,3],[4,5,6]]);
    })
    it('A multidimensional array is given. Throws an error, because it\'s limited to two dimensions', () => {
        //idk tensor math, so I limited matrix to two dimensions
        expect(() =>{
            let matrix = new Matrix([[[1],[2],[3]],[[4],[5],[6]]]);
        }).to.throw(Error, 'Matrix is bound to two dimensions. Given 3 dimensions');
    })
    it('A wrong type is given, throws an error', () => {
        expect(() => {
            let matrix = new Matrix(1);
        }).to.throw(TypeError);

    })
});
