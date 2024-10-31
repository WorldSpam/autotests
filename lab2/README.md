# Second lab

"Inspiration" for code was taken from [mathjs repository](https://github.com/josdejong/mathjs) and adapted for usage in class. 

## How to use:
- Pull
- Run `npm install` in corresponding directory
- Run `npm test` to do the magic

## Preview of results:
```console
> lab2@1.0.0 test
> mocha



  Matrix creation
    ✔ No arguments given. Creates an empty 1 x 1 matrix
    ✔ An empty array is given. Creates an empty 1 x 1 matrix
    ✔ An array is given. Creates a matrix from it
    ✔ A two dimensional array is given. Creates a matrix from it
    ✔ A multidimensional array is given. Throws an error, because it's limited to two dimensions
    ✔ A wrong type is given, throws an error
    ✔ Matrix from another matrix
    ✔ Matrix from an object. aka from JSON

  Matrix properties
    ✔ determinant
    ✔ rank
    ✔ trace
    inverse
      ✔ inverse true
      ✔ inverse det = 0

  Matrix methods
    ✔ toString
    ✔ transpose
    get
      ✔ get normal
      ✔ get throws on wrong index
      ✔ get from a single array
      ✔ get with wrong dimensions
    set
      ✔ set normal
      ✔ set throws on wrong index
      ✔ set from a single array
      ✔ set with wrong dimensions
    add
      ✔ add two matrices
      ✔ add matrix and number
      ✔ check size error
      ✔ check type error
    subtract
      ✔ subtract two matrices
      ✔ subtract matrix and number
      ✔ check size error
      ✔ check type error
    multiply
      ✔ multiply two matrices
      ✔ multiply matrix and number
      ✔ multiply matrix on vector
      ✔ multiply two vectors
      ✔ check size error
      ✔ check type error
    divide
      ✔ divide two matrices
      ✔ divide matrix and number

  Matrix static creation methods
    ✔ identity
    ✔ zeros
    ✔ ones

  Is... checks
    ✔ isArray()
    ✔ isNumber
    ✔ isMatrix
    isZero
      ✔ numeric true
      ✔ numeric false
      ✔ array true
      ✔ array false
      ✔ matrix true
      ✔ matrix false

  Object
    ✔ clone()

  array
    ✔ get()
    ✔ validateIndex()
    arraySize()
      ✔ [[1,2,3],[1,2,3]] = [2,3]
      ✔ [1,2] = [2]
      ✔ [1,2,3] = [3]
    validate() array (should throw)
      ✔ validate [1,2,3] with wrong size [1]
      ✔ validate [1,2,3] with right size [3]
      ✔ validate [[1,2,3],[1,2,3]] with wrong size [2,4]
      ✔ validate [[1,2,3],[1,2,3]] with right size [2,3]
      ✔ validate [[1,2,3],[1,2]] (uneven dimensions)

  Errors
    ✔ DimensionError
    ✔ IndexError


  64 passing (31ms)
  ```