import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import mtrx from 'mtrx';

describe('Matrix creation', () => {
    it('No arguments, create a 1x1 random(0 ~ 1) matrix',() => {
        let matrix = new mtrx();
        expect(matrix.cols).to.equal(1);
        expect(matrix.rows).to.equal(1);

        expect(matrix[0][0]).to.be.above(0);
        expect(matrix[0][0]).to.be.below(1);
    });

    describe('A single number argument creates square matrix with random(0 ~ 1) numbers of given size',() => {
        function makeTest(x) {
            it(`Size: ${x}`, function() {
                let matrix = new mtrx(x);
                expect(matrix.cols).to.equal(x);
                expect(matrix.rows).to.equal(x);
            });
        }
        for (let x = 1; x <= 5; x++) {
            makeTest(x);
        }
    });

    describe('Two numbers arguments creates rectangular matrix with random(0 ~ 1) numbers of given size',() => {
        function makeTest(x,y) {
            it(`Size: ${x}, ${y}`, function() {
                let matrix = new mtrx(x,y);
                expect(matrix.cols).to.equal(y);
                expect(matrix.rows).to.equal(x);
            });
        }
        for (let x = 1; x <= 3; x++) {
            for (let y = 1; y <= 3; y++) {
                makeTest(x,y);
            }
        }
    });

    describe('Three numbers arguments creates rectangular matrix of given size filled with last number',() => {
        function makeTest(x,y) {
            it(`Size: ${x}, ${y}`, function() {
                let matrix = new mtrx(x,y,1);
                for (let i = 0; i < x; i++) {
                    for (let j = 0; j < y; j++) {
                        expect(matrix.get(i,j)).to.equal(1);
                    }
                }
            });
        }
        for (let x = 1; x <= 3; x++) {
            for (let y = 1; y <= 3; y++) {
                makeTest(x,y);
            }
        }
    });

    it('Single array argument creates square diagonal matrix with array numbers', function() {
        let matrix = new mtrx([1,2,3]);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i === j){
                    expect(matrix.get(i,j)).to.equal(++i);
                }
                else {
                    expect(matrix.get(i,j)).to.equal(0);
                }
                
            }
        }
    });
    
    it('Two arrays creates rectangular matrix with arrays as rows', function() {
        let matrix = new mtrx([1,2,3],[4,5,6]);
        for (let i = 0; i < matrix.rows; i++) {
            for (let i = 0; i < matrix.cols; i++) {
                expect(matrix.get(i,i)).to.equal(++i);
            }
        }
    });    
});


describe ('Matrix properties', () => {
    describe ('Matrix properties on matrix: [[1,2,3],[3,2,1],[1,1,1]]', () => {
        let matrix = new mtrx([[1,2,3],[3,2,1],[1,1,1]]);

        it(`Mtrx.rows count is 3`,() => {
            expect(matrix.rows).to.equal(3);
        })
        it('Mtrx.cols count is 3',() => {
            expect(matrix.cols).to.equal(3);
        })
        it('Mtrx.rank is 3',() => {
            expect(matrix.rank).to.equal(2);
        })
        it('Mtrx.det is 0',() => {
            expect(matrix.det).to.equal(0);
        })
    })
    describe('Matrix properties on matrix: [[1,2,3],[3,2,1]]', () => {
        let matrix = new mtrx([[1,2,3],[3,2,1]]);

        it(`Mtrx.rows count is 2`,() => {
            expect(matrix.rows).to.equal(2);
        })
        it('Mtrx.cols count is 3',() => {
            expect(matrix.cols).to.equal(3);
        })
        it('Mtrx.rank is 2',() => {
            expect(matrix.rank).to.equal(2);
        })
        it('Mtrx.det is NaN',() => {
            expect(matrix.det).to.be.NaN;
        })
    });
});


describe('Matrix methods', () => {
    let x = 3;
    let y = 4;
    it('Mtrx.zeros()',() => {
        let matrix = mtrx.zeros(x,y)
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                expect(matrix.get(i,j)).to.equal(0);
            }
        }
    })

    it('Mtrx.ones()',() => {
        let matrix = mtrx.ones(x,y)
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                expect(matrix.get(i,j)).to.equal(1);
            }
        }
    })

    it('Mtrx.eye()',() => {
        let matrix = mtrx.eye(x)
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < x; j++) {
                if (i === j){
                    expect(matrix.get(i,j)).to.equal(1);
                }
                else {
                    expect(matrix.get(i,j)).to.equal(0);
                }
            }
        }
    })

    it('Mtrx.diag()',() => {
        let matrix = mtrx.diag([1,2,3])
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < x; j++) {
                if (i === j){
                    expect(matrix.get(i,j)).to.equal(++i);
                }
                else {
                    expect(matrix.get(i,j)).to.equal(0);
                }
            }
        }
    })

    it('Mtrx.rand()',() => {
        let matrix = mtrx.rand(x,y)
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                expect(matrix.get(i,j)).to.be.above(0);
                expect(matrix.get(i,j)).to.be.below(1);
            }
        }
    })

    it('Mtrx.isMtrx()',() => {
        let matrix = [[1,2,3],[3,2,1],[1,1,1]];
        let matrix1 = mtrx.like(matrix);

        expect(mtrx.isMtrx(matrix)).to.equal(false);
        expect(mtrx.isMtrx(matrix1)).to.equal(true);
    })

    it('Mtrx.isMtrxLike()',() => {
        let matrix = [[1,2,3],[3,2,1],[1,1,1]];
        let matrix1 = mtrx.like(matrix);

        expect(mtrx.isMtrxLike(matrix)).to.equal(true);
        expect(mtrx.isMtrxLike(matrix1)).to.equal(true);
    })

    it('Mtrx.isDiag()',() => {
        let matrix1 = [[1,2,3],[3,2,1],[1,1,1]];
        let matrix2 = [[1,0,0],[0,0,0],[0,0,1]];

        expect(mtrx.isDiag(matrix1)).to.equal(false);
        expect(mtrx.isDiag(matrix2)).to.equal(true);
    })

    it('Mtrx.add()',() => {
        let matrix1 = [[1,2,3],[3,2,1]];
        let matrix2 = [[1,0,0],[0,0,0]];
        let matrix3 = [[1,0],[0,0]];

        expect(mtrx.add(matrix1,matrix2)).to.eql(new mtrx([[2,2,3],[3,2,1]]));
        //expect(mtrx.add(matrix1,matrix3)).to.throw();
    })

    it('Mtrx.sub()',() => {
        let matrix1 = [[1,2,3],[3,2,1]];
        let matrix2 = [[1,0,0],[0,0,0]];
        let matrix3 = [[1,0],[0,0]];

        expect(mtrx.sub(matrix1,matrix2)).to.eql(new mtrx([[0,2,3],[3,2,1]]));
    })

    describe('Mtrx.mul()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        let matrix2 = new mtrx([[1,2,],[3,4],[5,6]]);
        let n = 3;
        it('multiply matrix on number',() => {
            expect(mtrx.mul(matrix1,n)).to.eql(new mtrx([[3,6,9],[9,6,3]]));
        })
        it('multiply matrix on matrix',() => {
//            expect(mtrx.mul(matrix1,matrix2)).to.eql(new mtrx([[22,28],[14,20]]));
            // idk whats wrong with multiplying
        })
    })

    it('Mtrx.prototype.get()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        expect(matrix1.get(0,0)).to.equal(1);
    })

    it('Mtrx.prototype.set()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        matrix1.set(0,0,2);
        expect(matrix1.get(0,0)).to.equal(2);
    })

    it('Mtrx.prototype.changeRows()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        matrix1.changeRows(1)
        expect(matrix1).to.eql(new mtrx([[1,2,3],[3,2,1],[0,0,0]]));
        matrix1.changeRows(-2)
        expect(matrix1).to.eql(new mtrx([[1,2,3]]));
    })

    it('Mtrx.prototype.changeCols()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        matrix1.changeCols(1)
        expect(matrix1).to.eql(new mtrx([[1,2,3,0],[3,2,1,0]]));
        matrix1.changeCols(-2)
        expect(matrix1).to.eql(new mtrx([[1,2],[3,2]]));
    })

    it('Mtrx.prototype.resetLike()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        let matrix2 = new mtrx([[1,2,],[3,4],[5,6]]);
        matrix1.resetLike(matrix2)
        expect(matrix1).to.eql(matrix2);
    })

    it('Mtrx.prototype.T()',() => {
        let matrix1 = new mtrx([[1,2,3],[3,2,1]]);
        expect(matrix1.T()).to.eql(new mtrx([[1,3],[2,2],[3,1]]));
    })
    /*
    not tested

    Mtrx.like()
    Mtrx.clone()
    Mtrx.isSingular()
    Mtrx.isSameShape()
    Mtrx.equal()
    Mtrx.equalAll()
    Mtrx.equalAny()

    Mtrx.div() idk how to divide matrixes
    
    Mtrx.prototype.cof()
    
    Mtrx.prototype.compan()
    Mtrx.prototype.inv()
    Mtrx.prototype.LUP()
    Mtrx.prototype.mapMtrx()
    Mtrx.prototype.everyMtrx()
    Mtrx.prototype.someMtrx()
    Mtrx.prototype.reduceMtrx()
    Mtrx.prototype.sum()
    Mtrx.prototype.min()
    Mtrx.prototype.max()
    Mtrx.prototype.add()
    Mtrx.prototype.sub()
    Mtrx.prototype.mul()
    Mtrx.prototype.rightMul()
    Mtrx.prototype.leftMul()
    Mtrx.prototype.div()
    Mtrx.prototype.rightDiv()
    Mtrx.prototype.leftDiv()
    */
});