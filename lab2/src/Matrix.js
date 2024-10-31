import { isArray, isMatrix, isNumber, isInteger, isZero } from "./is.js";
import { clone } from "./object.js";
import { arraySize, validate, get, validateIndex } from "./array.js";
import {add, subtract, multiply, divide} from "./arithmetic.js";
import {DimensionError} from "./DimensionError.js";

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

    /**
     * Replace an element in the matrix.
     * @param {number[]} index   
     * @param {*} value
     * @return {DenseMatrix} self
     */
    set(index, value) {
        if (!isArray(index)) { throw new TypeError('Array expected') }
        this.#checkBounds(index)
        let i, ii, indexI
        // traverse over the dimensions
        let data = this.#data
        for (i = 0, ii = index.length - 1; i < ii; i++) {
            indexI = index[i]
            validateIndex(indexI, data.length)
            data = data[indexI]
        }

        // set new value
        indexI = index[index.length - 1]
        validateIndex(indexI, data.length)
        data[indexI] = value

        return this
    }

    /**
     * Check if given index is out of bounds
     * @param {Array} array         Array to check 
     * @param {number[]} index      Array with index in each dimension
     * @private
     */
    #checkBounds(index) {
        if (index.length !== this.#size.length) {
            throw new DimensionError(index.length, this.#size.length)
        }
        for (let x = 0; x < index.length; x++) {
            validateIndex(index[x], this.#size[x])
            if (index[x] >= this.#size[x]) {
                throw new IndexError(index[x], this.#size[x])
            }
        }
    }

    clone() {
        const matrix = new Matrix({
            data: clone(this.#data),
            size: clone(this.#size)
        })
        return matrix
    }

    toString() {
        if(this.#size.length === 1) return this.#data.join(',')
        return this.#data.map(row => row.join(',')).join('\n')
    }

    transpose() {
        switch (this.#size.length) {
            case 1:
                return this.clone()
            case 2:
                let result = []
                let transRow

                const rows = this.#size[0]
                const columns = this.#size[1]
                
                if (columns === 0) {throw new RangeError('Cannot transpose 2d matrix with no columns. Size: ' + this._size.length)}
                
                for (let x = 0; x < columns; x++) {
                    // initialize row
                    transRow = result[x] = []
                    for (let y = 0; y < rows; y++) {
                        transRow[y] = this.#data[y][x]
                    }
                }
                return new Matrix(result)
            default:
                throw new RangeError('Two dimensions maximum. Size: ' + this.#size.length)
        }
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

      /**
     * Adddition Matrix x Matrix or Matrix x Number
     * @param {Matrix} a - first matrix
     * @param {Matrix|Number} b - second matrix or number
     * @returns {Matrix}
     */
    static add(a, b) {
        if (isMatrix(a) && isMatrix(b)) {
          return Matrix.#_arithmeticMM(a, b, add)
        } else if (isMatrix(a) && isNumber(b)) {
          return Matrix.#_arithmeticMN(a, b, add)
        } else throw new TypeError('Unsupported type of data ( a: ' + a.constructor.name + ', b: ' + b.constructor.name + ')')
      }
  
      /**
       * Subtraction Matrix x Matrix or Matrix x Number
       * @param {Matrix} a - first matrix
       * @param {Matrix|Number} b - second matrix or number
       * @returns {Matrix}
       */
      static sub(a, b) {
        if (isMatrix(a) && isMatrix(b)) {
          return Matrix.#_arithmeticMM(a, b, subtract)
        }else if (isMatrix(a) && isNumber(b)) {
          return Matrix.#_arithmeticMN(a, b, subtract)
        } else throw new TypeError('Unsupported type of data ( a: ' + a.constructor.name + ', b: ' + b.constructor.name + ')')
      }
  
      /**
       * Multiplication Matrix x Matrix or Matrix x Number
       * @param {Matrix} a - first matrix
       * @param {Matrix|Number} b - second matrix or number
       * @returns {Matrix}
       */
      static mul(a, b) {
        if (isMatrix(a) && isMatrix(b)) {
          // dimensions
          const asize = a.size
          const bsize = b.size
  
          // check dimensions
          Matrix.#_validateMatrixDimensions(asize, bsize)
          
          /* unnecessary optimization
          // process dimensions
          if (xsize.length === 1) {
            // process y dimensions
            if (ysize.length === 1) {
              // Vector * Vector
              return _multiplyVectorVector(x, y, xsize[0])
            }
            // Vector * Matrix
            return _multiplyVectorMatrix(x, y)
          }
          // process y dimensions
          if (ysize.length === 1) {
            // Matrix * Vector
            return _multiplyMatrixVector(x, y)
          }*/
          // Matrix * Matrix
          return Matrix.#_multiplyMM(a, b)
          //return Matrix.#_arithmeticMM(a, b, multiply)
        } else if (isMatrix(a) && isNumber(b)) {
          return Matrix.#_arithmeticMN(a, b, multiply)
        } else throw new TypeError('Unsupported type of data ( a: ' + a.constructor.name + ', b: ' + b.constructor.name + ')')
      }
  
      static #_validateMatrixDimensions(size1, size2) {
        // check left operand dimensions
      switch (size1.length) {
        case 1:
          // check size2
          switch (size2.length) {
            case 1:
              // Vector x Vector
              if (size1[0] !== size2[0]) {
                // throw error
                throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length')
              }
              break
            case 2:
              // Vector x Matrix
              if (size1[0] !== size2[0]) {
                // throw error
                throw new RangeError('Dimension mismatch in multiplication. Vector length (' + size1[0] + ') must match Matrix rows (' + size2[0] + ')')
              }
              break
            default:
              throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)')
          }
          break
        case 2:
          // check size2
          switch (size2.length) {
            case 1:
              // Matrix x Vector
              if (size1[1] !== size2[0]) {
                // throw error
                throw new RangeError('Dimension mismatch in multiplication. Matrix columns (' + size1[1] + ') must match Vector length (' + size2[0] + ')')
              }
              break
            case 2:
              // Matrix x Matrix
              if (size1[1] !== size2[0]) {
                // throw error
                throw new RangeError('Dimension mismatch in multiplication. Matrix A columns (' + size1[1] + ') must match Matrix B rows (' + size2[0] + ')')
              }
              break
            default:
              throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)')
          }
          break
        default:
          throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix A has ' + size1.length + ' dimensions)')
      }
      }
    /**
     * C = A * B
     * @param {Matrix} a - Matrix (MxN)
     * @param {Matrix} b - Matrix (NxC)
     *
     * @return {Matrix}  - Matrix (MxC)
     */
    static #_multiplyMM (a, b) { 
      
      const adata = a.#data
      const asize = a.#size
      
      const bdata = b.#data
      const bsize = b.#size
      
      const arows = asize[0]
      const acolumns = asize[1]
      const bcolumns = bsize[1]
  
       // result
      const c = []
  
      // loop matrix a rows
      for (let i = 0; i < arows; i++) {
        // current row
        const row = adata[i]
        // initialize row array
        c[i] = []
        // loop matrix b columns
        for (let j = 0; j < bcolumns; j++) {
          // sum (avoid initializing sum to zero)
          let sum = multiply(row[0], bdata[0][j])
          // loop matrix a columns
          for (let x = 1; x < acolumns; x++) {
            // multiply & accumulate
            sum = add(sum, multiply(row[x], bdata[x][j]))
          }
          c[i][j] = sum
        }
      }
  
      // return matrix
      return new Matrix({
        data: c,
        size: [arows, bcolumns],
      })
    }
  
      /**
       * Division Matrix x Matrix or Matrix x Number
       * @param {Matrix} a - first matrix
       * @param {Matrix|Number} b - second matrix or number
       * @returns {Matrix}
       */
      static div(a, b) {
        if (isMatrix(a) && isMatrix(b)) {
          // dimensions
          const asize = a.size
          const bsize = b.size
  
          // check dimensions
          Matrix.#_validateMatrixDimensions(asize, bsize)
          // Matrix * Matrix
          return Matrix.#_multiplyMM(a, b.inv())
          //return Matrix.#_arithmeticMM(a, b, multiply)
        } else if (isMatrix(a) && isNumber(b)) {
          return Matrix.#_arithmeticMN(a, b, divide)
        } else throw new TypeError('Unsupported type of data ( a: ' + a.constructor.name + ', b: ' + b.constructor.name + ')')
      }
  
      /**
       * Boilerplate for iteration through matrixes during arithmetic operations
       * between two matrixes
       * @param {Matrix} a - Frist matrix
       * @param {Matrix} b - second matrix
       * @param {Function} callback - function to execute [add/substract/-multiply/divide-]
       * (multiplication and division are supported by Matrix.#_multiplyMM() )
       * @private
       */
      static #_arithmeticMM(a,b,callback){
        // a arrays
        const adata = a.#data
        const asize = a.#size
        // b arrays
        const bdata = b.#data
        const bsize = b.#size
        // c arrays
        const csize = []
  
        // validate dimensions
        if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }
  
        // validate each one of the dimension sizes
        for (let i = 0; i < asize.length; i++) {
          // must match
          if (asize[i] !== bsize[i]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }
          // update dimension in c
          csize[i] = asize[i]
        }
  
        const cdata = csize.length > 0 ? Matrix.#_iterateMM(callback, 0, csize, csize[0], adata, bdata) : []
  
        // c matrix
        return new Matrix({
          data: cdata,
          size: csize,
        })
      }
  
      /**
       * Recursive iteration for arithmetics between two matrixes
       * @param {Function} func - function to apply to each element
       * @param {Number} level - current level in iteration
       * @param {Number[]} size_arr - array of sizes of each dimension
       * @param {Number} curr#size - size of current dimension
       * @param {Number[]} a#data - array of values for first matrix
       * @param {Number[]} b#data - array of values for second matrix
       * @returns {Number[]} - resulting array for matrix
       * @private
       */
      static #_iterateMM(func, level, size_arr, curr_size, a_data, b_data) {
        const c_arr = []
  
        // check we reach the last level
        if (level === size_arr.length - 1) {
          // loop arrays in last level
          for (let i = 0; i < curr_size; i++) {
            // invoke callback and store value
            c_arr[i] = func(a_data[i], b_data[i])
          }
        } else {
          // iterate current level
          for (let j = 0; j < curr_size; j++) {
            // iterate next level
            c_arr[j] = Matrix.#_iterateMM(func, level + 1, size_arr, size_arr[level + 1], a_data[j], b_data[j])
          }
        }
        return c_arr
      }
  
      /**
       * Boilerplate for iteration through matrix during arithmetic operations
       * between two matrixes
       * @param {Matrix} a - Frist matrix
       * @param {Number} b - number
       * @param {Function} callback - function to execute [add/substract/multiply/divide]
       * @private
       */
      static #_arithmeticMN(a, b, callback) {
        const adata = a.#data
        const asize = a.#size
  
        const cdata = asize.length > 0 ? Matrix.#_iterateMN(callback, 0, asize, asize[0], adata, b) : []
  
        return new Matrix({
          data: cdata,
          size: clone(asize),
        })
      }
  
      /**
       * Recursive iteration for arithmetics between matrix and a number
       * @param {Function} func - function to apply to each element
       * @param {Number} level - current level in iteration
       * @param {Number[]} size_arr - array of sizes of each dimension
       * @param {Number} curr#size - size of current dimension
       * @param {Number[]} a#data - array of values for first matrix
       * @param {Number} b - number
       * @returns {Number[]} - resulting array for matrix
       * @private
       */
      static #_iterateMN(func, level, size_arr, curr_size, a_data, b) {
        const c_arr = []
        if (level === size_arr.length - 1) {
          for (let i = 0; i < curr_size; i++) {
            c_arr[i] = func(a_data[i], b)
          }
        } else {
          for (let j = 0; j < curr_size; j++) {
            c_arr[j] = Matrix.#_iterateMN(func, level + 1, size_arr, size_arr[level + 1], a_data[j], b)
          }
        }
        return c_arr
      }

}

export default Matrix
