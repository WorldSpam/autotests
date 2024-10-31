import Matrix from '../src/Matrix.js';
import { isArray, isInteger, isNumber, isMatrix, isZero } from '../src/is.js';
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
    it('determinant', () => {
        const matrix = new Matrix([[2,2,3],[4,5,6],[7,8,9]]);
        expect(matrix.det()).to.equal(-3);
    })
    describe('inverse', () => {
        it('inverse true', () => {
            let matrix = new Matrix([[3, 1, 4], [2, 4, 5], [8, 0, 1]]);
            
            expect(matrix.inv()).to.deep.equal(new Matrix([[ -0.05128205128205128, 0.01282051282051282, 0.14102564102564102 ],
                [ -0.48717948717948717, 0.3717948717948718, 0.08974358974358973 ],
                [ 0.41025641025641024, -0.10256410256410256, -0.1282051282051282 ]]));
        })
        it('inverse det = 0', () => {
            let matrix = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
            expect(() => matrix.inv()).to.throw(Error,'Cannot calculate inverse, determinant is zero');
        })
    })
    it('rank', () => {
        let matrix = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
        expect(matrix.rank()).to.equal(2);
    })
    it('trace', () => {
        let matrix = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
        expect(matrix.trace()).to.equal(15);
    })
})

describe('Matrix methods', () => {
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

    describe('set', () => {
        it('set normal', () => {
            let matrix = new Matrix([[1,2,3],[4,5,6]]);
            matrix.set([0,2],10);
            expect(matrix.get([0,2])).to.equal(10);
        })
        it('set throws on wrong index', () => {
            let matrix = new Matrix([[1,2,3],[4,5,6]]);
            expect(() => {
                let value = matrix.set([-1,-1],-1)
            }).to.throw(IndexError,'Index out of range (-1 < 0)');    
        })
        it('set from a single array', () => {
            let matrix = new Matrix([1,2,3]);
            matrix.set([0],10);
            expect(matrix.get([0])).to.equal(10);
        })
        it('set with wrong dimensions', () => {
            let matrix = new Matrix([[1,2,3],[4,5,6]]);
            expect(() => {
                let value = matrix.set([0,2,2],10)
            }).to.throw(DimensionError,'Dimension mismatch (3 != 2)');    
        })
    })

    it('toString', () => {
        let matrix = new Matrix([[1,2,3],[4,5,6]]);
        expect(matrix.toString()).to.equal('1,2,3\n4,5,6');
    })

    it('transpose', () => {
        const matrix = new Matrix([[1,2,3],[4,5,6]]);
        const tmatrix = new Matrix({
            data: [[1,4],[2,5],[3,6]],
            size: [3,2]
        });
        expect(matrix.transpose()).to.deep.equal(tmatrix);
    })

    describe('add', () => {
        it('add two matrices', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1,2,3],[4,5,6]]);
            expect(Matrix.add(matrix1,matrix2)).to.deep.equal(new Matrix([[2,4,6],[8,10,12]]));
        })
        it('add matrix and number', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            expect(Matrix.add(matrix1,10)).to.deep.equal(new Matrix([[11,12,13],[14,15,16]]));
        })
        it('check size error', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1,2],[4,5]]);
            expect(() => {
                Matrix.add(matrix1,matrix2)
            }).to.throw(RangeError, 'Dimension mismatch. Matrix A (2,3) must match Matrix B (2,2)');
        })
        it('check type error', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let bs = 'hello';
            expect(() => {
                Matrix.add(matrix1,bs)
            }).to.throw(TypeError,'Unsupported type of data ( a: Matrix, b: String)');
        })
    })

    describe('subtract', () => {
        it('subtract two matrices', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[6,5,9],[23,6,7]]);
            expect(Matrix.sub(matrix1,matrix2)).to.deep.equal(new Matrix([[-5,-3,-6],[-19,-1,-1]]));
        })
        it('subtract matrix and number', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            expect(Matrix.sub(matrix1,10)).to.deep.equal(new Matrix([[-9,-8,-7],[-6,-5,-4]]));
        })
        it('check size error', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1,2],[4,5]]);
            expect(() => {
                Matrix.sub(matrix1,matrix2)
            }).to.throw(RangeError, 'Dimension mismatch. Matrix A (2,3) must match Matrix B (2,2)');
        })
        it('check type error', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = 'hello';
            expect(() => {
                Matrix.sub(matrix1,matrix2)
            }).to.throw(TypeError,'Unsupported type of data ( a: Matrix, b: String)');
        })
    })

    describe('multiply', () => {
        it('multiply two matrices', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1,2],[3,4],[5,6]]);
            expect(Matrix.mul(matrix1,matrix2)).to.deep.equal(new Matrix([[22,28],[49,64],]));
        })
        it('multiply matrix and number', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            expect(Matrix.mul(matrix1,10)).to.deep.equal(new Matrix([[10,20,30],[40,50,60]]));
        })
        it('multiply matrix on vector', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1],[2],[3]]);
            expect(Matrix.mul(matrix1,matrix2)).to.deep.equal(new Matrix([[14],[32]]));
        })
        it('multiply two vectors', () => {
            let matrix1 = new Matrix([[1,2,3]]);
            let matrix2 = new Matrix([[1],[2],[3]]);
            expect(Matrix.mul(matrix1,matrix2)).to.deep.equal(new Matrix([[14]]));
        })
        it('check size error', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1,2],[4,5]]);
            expect(() => {
                Matrix.mul(matrix1,matrix2)
            }).to.throw(RangeError, 'Dimension mismatch in multiplication. Matrix A columns (3) must match Matrix B rows (2)');
        })
        it('check type error', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = 'hello';
            expect(() => {
                Matrix.mul(matrix1,matrix2)
            }).to.throw(TypeError,'Unsupported type of data ( a: Matrix, b: String)');
        })
    })

    describe('divide', () => {
        
        it('divide two matrices', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            let matrix2 = new Matrix([[1,2,3],[3,4,10],[5,6,9]]);
            // I hate float precision
            expect(Matrix.div(matrix1,matrix2)).to.deep.equal(new Matrix([[1.0000000000000002,0,5.551115123125783e-17],[0.4375000000000009,-0.3750000000000002,0.9375000000000002]]));
        })
        it('divide matrix and number', () => {
            let matrix1 = new Matrix([[1,2,3],[4,5,6]]);
            expect(Matrix.div(matrix1,10)).to.deep.equal(new Matrix([[0.1,0.2,0.3],[0.4,0.5,0.6]]));
        })
        //divide vectors is impossible here
        //errors are already in multiplication
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
    describe('isZero', () => {
        it('numeric true', () => {
            let zero = 0;
            expect(isZero(zero)).to.equal(true);
        })
        it('numeric false', () => {
            let zero = -1;
            expect(isZero(zero)).to.equal(false);
        })
        it('array true', () => {
            let zero = [0,0,0];
            expect(isZero(zero)).to.equal(true);
        })
        it('array false', () => {
            let zero = [1,2,3];
            expect(isZero(zero)).to.equal(false);
        })
        it('matrix true', () => {
            let zero = new Matrix([0,0,0]);
            expect(isZero(zero)).to.equal(true);
        })
        it('matrix false', () => {
            let zero = new Matrix([1,2,3]);
            expect(isZero(zero)).to.equal(false);
        })
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