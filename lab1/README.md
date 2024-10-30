# First lab

Here are tests of some methods in matrix class from [this](https://github.com/zhufuge/Mtrx) repository.

How to use:
- Pull
- Run `npm install` in corresponding directory
- Run `npm test` to do the magic

Preview of results:
```console
> lab1@1.0.0 test
> mocha



  Matrix creation
    ✔ No arguments, create a 1x1 random(0 ~ 1) matrix
    ✔ Single array argument creates square diagonal matrix with array numbers
    ✔ Two arrays creates rectangular matrix with arrays as rows
    A single number argument creates square matrix with random(0 ~ 1) numbers of given size
      ✔ Size: 1
      ✔ Size: 2
      ✔ Size: 3
      ✔ Size: 4
      ✔ Size: 5
    Two numbers arguments creates rectangular matrix with random(0 ~ 1) numbers of given size
      ✔ Size: 1, 1
      ✔ Size: 1, 2
      ✔ Size: 1, 3
      ✔ Size: 2, 1
      ✔ Size: 2, 2
      ✔ Size: 2, 3
      ✔ Size: 3, 1
      ✔ Size: 3, 2
      ✔ Size: 3, 3
    Three numbers arguments creates rectangular matrix of given size filled with last number
      ✔ Size: 1, 1
      ✔ Size: 1, 2
      ✔ Size: 1, 3
      ✔ Size: 2, 1
      ✔ Size: 2, 2
      ✔ Size: 2, 3
      ✔ Size: 3, 1
      ✔ Size: 3, 2
      ✔ Size: 3, 3

  Matrix properties
    Matrix properties on matrix: [[1,2,3],[3,2,1],[1,1,1]]
      ✔ Mtrx.rows count is 3
      ✔ Mtrx.cols count is 3
      ✔ Mtrx.rank is 3
      ✔ Mtrx.det is 0
    Matrix properties on matrix: [[1,2,3],[3,2,1]]
      ✔ Mtrx.rows count is 2
      ✔ Mtrx.cols count is 3
      ✔ Mtrx.rank is 2
      ✔ Mtrx.det is NaN

  Matrix methods
    ✔ Mtrx.zeros()
    ✔ Mtrx.ones()
    ✔ Mtrx.eye()
    ✔ Mtrx.diag()
    ✔ Mtrx.rand()
    ✔ Mtrx.isMtrx()
    ✔ Mtrx.isMtrxLike()
    ✔ Mtrx.isDiag()
    ✔ Mtrx.add()
    ✔ Mtrx.sub()
    ✔ Mtrx.prototype.get()
    ✔ Mtrx.prototype.set()
    ✔ Mtrx.prototype.changeRows()
    ✔ Mtrx.prototype.changeCols()
    ✔ Mtrx.prototype.resetLike()
    ✔ Mtrx.prototype.T()
    Mtrx.mul()
      ✔ multiply matrix on number
      ✔ multiply matrix on matrix


  52 passing (239ms)
  ```