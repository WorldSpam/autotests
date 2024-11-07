import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as chai from 'chai';
import { assert, expect } from 'chai';
//import Mtrx from '../src/matrix.js';
import Matrix from '../src/Matrix.js';
chai.use(sinonChai);
//const expect = chai.expect;

describe('Matrix class from lab2 with sinon', () => {
    let matrix1;
    let get_spy, set_spy;
    let matrix1_mock;

    beforeEach(() => {
        matrix1 = new Matrix([
            [1, 2, 3],
            [4, 5, 6]
        ]);
        get_spy = sinon.spy(matrix1, 'get');
        set_spy = sinon.spy(matrix1, 'set');
    });

    afterEach(() => {
        get_spy.restore();
        set_spy.restore();
    });

    it('get method spy', () => {
        matrix1.get([1, 1]);
        assert(get_spy.calledOnce);
        assert(get_spy.calledWith([1, 1]));
    });
    it('set method spy', function() {
        matrix1.set([1, 1], 10);
        assert(set_spy.calledOnce);
        assert(set_spy.calledWith([1, 1], 10));
    });

    it('toString() stub', function() {
        const toString_stub = sinon.stub(matrix1, 'toString').returns("There should have been other string");
        const result = matrix1.toString();
        expect(result).to.equal("There should have been other string");
        toString_stub.restore();
    });
    it('static method identity() stub', function() {
        const identity_stub = sinon.stub(Matrix, 'identity')
        identity_stub.withArgs(3).returns(new Matrix([[3,3,3], [3,3,3], [3,3,3]]));
        //.calledWith(3).returns(new Matrix([[3,3,3], [3,3,3], [3,3,3]]));
        const result = Matrix.identity(3);
        expect(result.data).to.deep.equal(new Matrix([[3,3,3], [3,3,3], [3,3,3]]).data);

        identity_stub.restore();
    });
})