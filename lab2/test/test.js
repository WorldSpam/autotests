import Matrix from '../src/Matrix.js';
import { isArray, isInteger, isNumber, isMatrix } from '../src/is.js';
import { clone } from '../src/object.js';
import { arraySize, validate, get, validateIndex } from '../src/array.js';
import { DimensionError } from '../src/DimensionError.js';
import { IndexError } from '../src/IndexError.js';
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
    it('Matrix from another matrix', () => {
        let matrix = new Matrix([[1,2,3],[4,5,6]]);
        let matrix2 = new Matrix(matrix);
        expect(matrix2.size).to.deep.equal([2,3]);
        expect(matrix2.data).to.deep.equal([[1,2,3],[4,5,6]]);
    })
    it('Matrix from an object. aka from JSON', () => {
        let matrix = new Matrix({size:[2,3],data:[[1,2,3],[4,5,6]]});
        expect(matrix.size).to.deep.equal([2,3]);
        expect(matrix.data).to.deep.equal([[1,2,3],[4,5,6]]);
    })
});

describe('Matrix properties', () => {
    describe('get', () => {
        it('get normal', () => {
            let matrix = new Matrix([[1,2,3],[4,5,6]]);
            expect(matrix.get([0,2])).to.equal(3);    
        })
        it('get throws on wrong index', () => {
            let matrix = new Matrix([[1,2,3],[4,5,6]]);
            expect(() => {
                let value = matrix.get([-1,-1])
            }).to.throw(IndexError,'Index out of range (-1 < 0)');    
        })
        it('get from a single array', () => {
            let matrix = new Matrix([1,2,3]);
            expect(matrix.get([0])).to.equal(1);
        })
        it('get with wrong dimensions', () => {
            let matrix = new Matrix([1,2,3]);
            expect(() => {
                let value = matrix.get([0,2])
            }).to.throw(DimensionError,'Dimension mismatch (2 != 1)');
        })
    })
})

describe('Matrix static creation methods', () => {
    it('identity', () => {
        let matrix = Matrix.identity(3);
        expect(matrix.size).to.deep.equal([3,3]);
        expect(matrix.data).to.deep.equal([[1,0,0],[0,1,0],[0,0,1]]);
    })
    it('zeros', () => {
        let matrix = Matrix.zeros([3,3]);
        expect(matrix.size).to.deep.equal([3,3]);
        expect(matrix.data).to.deep.equal([[0,0,0],[0,0,0],[0,0,0]]);
    })
    it('ones', () => {
        let matrix = Matrix.ones([3,3]);
        expect(matrix.size).to.deep.equal([3,3]);
        expect(matrix.data).to.deep.equal([[1,1,1],[1,1,1],[1,1,1]]);
    })
})

describe('Is... checks', () => {
    it('isArray()', () => {
        let array = [3];
        expect(isArray(array)).to.equal(true);
    })
    it('isNumber', () => {
        let number = 3;
        expect(isNumber(number)).to.equal(true);
    })
    it('isMatrix', () => {
        let matrix = new Matrix();
        expect(isMatrix(matrix)).to.equal(true);
    })
})

describe('Object', () => {
    it('clone()', () => {
        let obj = [[1,2,3],[4,5,6]];
        let cloned = clone(obj);
        obj[0][0] = 0;
        expect(cloned).to.deep.equal([[1,2,3],[4,5,6]]);
    })
})

describe('array', () => {
    describe('arraySize()', () => {
        it('[[1,2,3],[1,2,3]] = [2,3]', () => {
            let array = [[1,2,3],[1,2,3]];
            expect(arraySize(array)).to.deep.equal([2,3]);
        })
        it('[1,2] = [2]', () => {
            let array = [1,2];
            expect(arraySize(array)).to.deep.equal([2]);
        })
        it('[1,2,3] = [3]', () => {
            let array = [1,2,3];
            expect(arraySize(array)).to.deep.equal([3]);
        })
    })
    describe('validate() array (should throw)', () => {
        it('validate [1,2,3] with wrong size [1]', () => {
            let array = [1,2,3];
            let size = [1];
            expect(() => {
                validate(array, size);
            }).to.throw(DimensionError);
        })
        it('validate [1,2,3] with right size [3]', () => {
            let array = [1,2,3];
            let size = [3];
            expect(() => {
                validate(array, size);
            }).to.not.throw(DimensionError);
        })
        it('validate [[1,2,3],[1,2,3]] with wrong size [2,4]', () => {
            let array = [[1,2,3],[1,2,3]];
            let size = [2,4];
            expect(() => {
                validate(array, size);
            }).to.throw(DimensionError);
        })
        it('validate [[1,2,3],[1,2,3]] with right size [2,3]', () => {
            let array = [[1,2,3],[1,2,3]];
            let size = [2,3];
            expect(() => {
                validate(array, size);
            }).to.not.throw(DimensionError);
        })
        it('validate [[1,2,3],[1,2]] (uneven dimensions)', () => {
            let array = [[1,2,3],[1,2]];
            let size = [2,3];
            expect(() => {
                validate(array, size);
            }).to.throw(DimensionError);
        })
    })
    it('get()', () => {
        let arr = [[1,2,3],[4,5,6]];
        expect(get(arr, [0,2])).to.equal(3);    
    })
    it('validateIndex()', () => {
        expect(() => {
            validateIndex(0, 3);
        }).to.not.throw();
        expect(() => {
            validateIndex(3, 3);
        }).to.throw(IndexError);
    })
})

describe('Errors', () => {
    it('DimensionError', () => {
        expect(() => {
            throw new DimensionError(3,4);
        }).to.throw(DimensionError,'Dimension mismatch (3 != 4)');
    })
    it('IndexError', () => {
        expect(() => {
            throw new IndexError(5,2,4);
        }).to.throw(IndexError,'Index out of range (5 > 3)');
    })
})