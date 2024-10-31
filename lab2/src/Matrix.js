import { isArray, isMatrix, isNumber, isInteger } from "./is.js";
import { clone } from "./object.js";
import { arraySize, validate, get } from "./array.js";

class Matrix{
    #data;
    #size;
    constructor(data){
        if (isMatrix(data)) {
            this.#data = clone(data.data);
            this.#size = clone(data.size);
        } else if (data && isArray(data.data) && isArray(data.size)) {
            // initialize fields from JSON representation
            this.#data = data.data
            this.#size = data.size
            // verify the dimensions of the array
            validate(this.#data, this.#size)
        } else if(isArray(data)){
            // get those arrays
            this.#data = clone(data);
            // get dimensions of the array
            this.#size = arraySize(this.#data);
            // verify the dimensions of the array, will throw if not valid
            validate(this.#data, this.#size)
        } else if (data) {
            // unsupported type
            throw new TypeError('Unsupported type of data (' + typeof(data) + ')')
        } else {
            // nothing provided
            this.#data = [];
            this.#size = [0];
        }  
    }

    /**
     * gets a number from given index array
     * @param {number[]} index 
     * @returns {number}
     */
    get(index) {
        return get(this.#data, index)
    }

    get data() {
        return this.#data
    }

    get size() {
        return this.#size
    }

    static zeros(row, col) {
        if(arguments.length === 1) {
            if(isNumber(row)) {
                col = row
            } else if(isArray(row)) {
                col = row[1]
                row = row[0]
            }
        }
        let matrix = []
        for (let i = 0; i < row; i++) {
            matrix.push([])
            for (let j = 0; j < col; j++) {
                matrix[i][j] = 0
            }
        }
        return new Matrix({data: matrix, size: [row, col]})
    }

    static identity(size) {
        if (!isInteger(size) || size < 1) {
            throw new Error('Parameter in function identity must be positive integers')
        }
        let matrix = []
        for (let i = 0; i < size; i++) {
            matrix.push([])
            for (let j = 0; j < size; j++) {
                matrix[i][j] = (i === j) ? 1 : 0
            }
        }
        return new Matrix(matrix)
    }

    /**
     * Creates a matrix filled with ones
     * @param {number} row - number of rows
     * @param {number} col - number of columns
     * @returns {Matrix} new matrix
     */
    static ones(row, col) {
        if(arguments.length === 1) {
            if(isNumber(row)) {
                col = row
            } else if(isArray(row)) {
                col = row[1]
                row = row[0]
            }
        }
        let matrix = []
        for (let i = 0; i < row; i++) {
            matrix.push([])
            for (let j = 0; j < col; j++) {
                matrix[i][j] = 1
            }
        }
        return new Matrix({data: matrix, size: [row, col]})
    }
}

export default Matrix
