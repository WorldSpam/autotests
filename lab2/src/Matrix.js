import { isArray, isMatrix, isNumber, isInteger, isZero } from "./is.js";
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

    clone() {
        const matrix = new Matrix({
            data: clone(this.#data),
            size: clone(this.#size)
        })
        return matrix
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

    det(){
        switch (this.#size.length) {
            case 1:
                if (this.#size[0] === 1) {
                    return mat[0]
                } else if (this.#size[0] === 0) {
                    return 1
                } else {
                    throw new RangeError('Cannot calculate determinant of non-square matrix. Size: ' + this.#size)
                }
            case 2:
                // two-dimensional array
                const rows = this.size[0]
                const cols = this.size[1]
                if (rows === cols) {
                    return this.#_det(this.clone().data, rows, cols)
                } if (cols === 0) {
                    return 1 // det of an empty matrix is per definition 1
                } else {
                    throw new RangeError('Matrix must be square ' + '(size: ' + format(size) + ')')
                }
            default:
                throw new RangeError('Two dimensions maximum. Size: ' + this.#size.length)
        }
    }

    /**
    * Calculate the determinant of a matrix
    * @param {Array[]} matrix  A square, two dimensional matrix
    * @param {number} rows     Number of rows of the matrix (zero-based)
    * @param {number} cols     Number of columns of the matrix (zero-based)
    * @returns {number} det
    * @private
    */
    #_det(matrix, rows, cols) {
      if (rows === 1) {
        // this is a 1 x 1 matrix
        return matrix[0][0]
      } else if (rows === 2) {
        // this is a 2 x 2 matrix
        // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
        return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]
      } else {
        // Bareiss algorithm
        // this algorithm have same complexity as LUP decomposition (O(n^3))
        // but it preserve precision of floating point more relative to the LUP decomposition
        let negated = false
        const rowIndices = new Array(rows).fill(0).map((_, i) => i) // matrix index of row i
        for (let k = 0; k < rows; k++) {
          let k_ = rowIndices[k]
          if (isZero(matrix[k_][k])) {
            let _k
            for (_k = k + 1; _k < rows; _k++) {
              if (!isZero(matrix[rowIndices[_k]][k])) {
                k_ = rowIndices[_k]
                rowIndices[_k] = rowIndices[k]
                rowIndices[k] = k_
                negated = !negated
                break
              }
            }
            if (_k === rows) return matrix[k_][k] // some zero of the type
          }
          const piv = matrix[k_][k]
          const piv_ = k === 0 ? 1 : matrix[rowIndices[k - 1]][k - 1]
          for (let i = k + 1; i < rows; i++) {
            const i_ = rowIndices[i]
            for (let j = k + 1; j < rows; j++) {
              matrix[i_][j] = (matrix[i_][j] * piv - matrix[i_][k] * matrix[k_][j]) / piv_
            }
          }
        }
        const det = matrix[rowIndices[rows - 1]][rows - 1]
        return negated ? (-1 *det) : det
      }
    }

    inv(){
        switch (this.#size.length) {
            case 1:
                // vector
                if (size[0] === 1) {
                    return new Matrix([1 / this.#data[0]])
                } else {
                    throw new RangeError('Matrix must be square ' + '(size: ' + this.#size + ')')
                }
            case 2:
            // two dimensional array
            
                const rows = this.#size[0]
                const cols = this.#size[1]
                if (rows === cols) {
                    let r, s, f, value, temp

                    if (rows === 1) {
                        // this is a 1 x 1 matrix
                        value = this.#data[0][0]
                        if (value === 0) {
                            throw Error('Cannot calculate inverse, determinant is zero')
                        }
                        return new Matrix([[1 / value]])
                    } else if (rows === 2) {
                        // this is a 2 x 2 matrix
                        const d = this.det()
                        if (d === 0) {
                            throw Error('Cannot calculate inverse, determinant is zero')
                        }
                        return new Matrix([
                            [this.#data[1][1] / d, (-1 * this.#data[0][1]) / d],
                            [(-1 * this.#data[1][0]) / d, this.#data[0][0] / d]
                        ])
                    } else {
                      // this is a matrix of 3 x 3 or larger
                      // calculate inverse using gauss-jordan elimination
                      //      https://en.wikipedia.org/wiki/Gaussian_elimination
                      //      http://mathworld.wolfram.com/MatrixInverse.html
                      //      http://math.uww.edu/~mcfarlat/inverse.htm
                      const d = this.det()
                      if (d === 0) {
                          throw Error('Cannot calculate inverse, determinant is zero')
                      }
                      // make a copy of the matrix (only the arrays, not of the elements)
                      const A = this.#data.concat()
                      for (r = 0; r < rows; r++) {
                          A[r] = A[r].concat()
                      }
                    
                      // create an identity matrix which in the end will contain the
                      // matrix inverse
                      const B = Matrix.identity(rows).#data

                      // loop over all columns, and perform row reductions
                      for (let c = 0; c < cols; c++) {
                          // Pivoting: Swap row c with row r, where row r contains the largest element A[r][c]
                          let ABig = Math.abs(A[c][c])
                          let rBig = c
                          r = c + 1
                          while (r < rows) {
                              if (Math.abs(A[r][c]) > ABig) {
                                  ABig = Math.abs(A[r][c])
                                  rBig = r
                              }
                              r++
                          }
                          if (ABig === 0) {
                            throw Error('Cannot calculate inverse, determinant is zero')
                          }
                          r = rBig
                          if (r !== c) {
                            temp = A[c]; A[c] = A[r]; A[r] = temp
                            temp = B[c]; B[c] = B[r]; B[r] = temp
                          }
                        
                          // eliminate non-zero values on the other rows at column c
                          const Ac = A[c]
                          const Bc = B[c]
                          for (r = 0; r < rows; r++) {
                              const Ar = A[r]
                              const Br = B[r]
                              if (r !== c) {
                                  // eliminate value at column c and row r
                                  if (Ar[c] !== 0) {
                                      f = (-1 * Ar[c]) / Ac[c]

                                      // add (f * row c) to row r to eliminate the value
                                      // at column c
                                      for (s = c; s < cols; s++) {
                                          Ar[s] = Ar[s] + f * Ac[s]
                                      }
                                      for (s = 0; s < cols; s++) {
                                          Br[s] = Br[s] + f * Bc[s]
                                      }
                                  }
                              } else {
                                  // normalize value at Acc to 1,
                                  // divide each value on row r with the value at Acc
                                  f = Ac[c]
                                  for (s = c; s < cols; s++) {
                                    Ar[s] = Ar[s] / f
                                  }
                                  for (s = 0; s < cols; s++) {
                                    Br[s] = Br[s] / f
                                  }
                                }
                              }
                          }
                          return new Matrix(B)
                      }                
                } else {
                throw new RangeError('Matrix must be square ' +
                  '(size: ' + this.#size + ')')
              }
            
    
            default:
              // multi dimensional array
              throw new RangeError('Matrix must be two dimensional ' +
              '(size: ' + this.#size + ')')
          }
    }

    /**
     * Calculate matrix rank using row echelon form
     * @returns {number} rank
     */
    rank() {
        const rows = this.#size[0]
        const cols = this.#size[1]
        const mat = clone(this.#data)
        let rank = cols;
    
        // Iterate over each row
        for (let row = 0; row < rank; row++) {
            if (mat[row][row] !== 0) {
                for (let i = 0; i < rows; i++) {
                    if (i !== row) {
                        const multiplier = mat[i][row] / mat[row][row];
                        for (let j = row; j < cols; j++) {
                            mat[i][j] -= multiplier * mat[row][j];
                        }
                    }
                }
            } else {
                let reduce = true;
                for (let i = row + 1; i < rows; i++) {
                    if (mat[i][row] !== 0) {
                        [mat[row], mat[i]] = [mat[i], mat[row]];
                        reduce = false;
                        break;
                    }
                }
                if (reduce) {
                    rank--;
                    for (let i = 0; i < rows; i++) {
                        mat[i][row] = mat[i][rank];
                    }
                }
                row--;
            }
        }
        return rank;
      }
  
      trace() {
        switch (this.#size.length){
          case 1:
            return this.#data[0]
          case 2:
            if (this.#size[0] === this.#size[1]) {
              let sum = 0
              for (let i = 0; i < this.#size[0]; i++) {
                sum += this.#data[i][i]
              }
              return sum
            } else {
              throw new RangeError('Matrix must be square ' + '(size: ' + this.#size + ')')
            } 
          default:
            throw new RangeError('Matrix must be two dimensional ' +
              '(size: ' + this.#size + ')')
        }
      }

}

export default Matrix
