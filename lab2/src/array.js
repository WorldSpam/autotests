// module to work with arrays
import { isArray, isInteger, isNumber } from "./is.js";
import { DimensionError } from "./DimensionError.js";
import { IndexError } from "./IndexError.js";

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x - array to measure
 * @Returns {Number[]} - array dimensions
 */
export function arraySize (x) {
    const s = []
  
    while (isArray(x)) {
      s.push(x.length)
      x = x[0]
    }
  
    return s
  }

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */

export function validate(array, size){
    if(size.length === 0){
        if (isArray(array)) {
            throw new DimensionError(array.length, 0)
        }
    } else {
        _validate(array, size, 0)   
    }   
}

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim   Current dimension
 * @throws DimensionError
 * @private
 */
function _validate(array,size, dim){
    //arbitrary bound to 2 dimensions
    if(dim > 1){
        throw new Error(`Matrix is bound to two dimensions. Given ${size.length} dimensions`)
    }

    let i
    const len = array.length

    if (len !== size[dim]) {
        throw new DimensionError(len, size[dim])
    }

    if (dim < size.length - 1) {
        // recursively validate each child array
        const dimNext = dim + 1
        for (i = 0; i < len; i++) {
            const child = array[i]
            if (!isArray(child)) {
                throw new DimensionError(size.length - 1, size.length, '<')
            }
            _validate(array[i], size, dimNext)
        }
    } else {
        // last dimension. none of the childs may be an array
        for (i = 0; i < len; i++) {
            if (isArray(array[i])) {
                throw new DimensionError(size.length + 1, size.length, '>')
            }
        }
    }
}

/**
 * get the element from an array
 * @param {Array} arr
 * @param {number[]} index
 * @returns {number}
 */
export function get(arr, index) {
    if (!isArray(arr) || !isArray(index)) {
        throw new Error('Array expected. Got ' + typeof(arr) + ', ' + typeof(index))
    }
    const size = arraySize(arr)
    if (index.length !== size.length) { 
        throw new DimensionError(index.length, size.length) 
    }
    for (let x = 0; x < index.length; x++) { 
        validateIndex(index[x], size[x])
    }
    return index.reduce((acc, curr) => acc[curr], arr)
}

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */
export function validateIndex (index, length) {
    if (index !== undefined) {
      if (!isNumber(index) || !isInteger(index)) {
        throw new TypeError('Index must be an integer (value: ' + index + ')')
      }
      if (index < 0 || (typeof length === 'number' && index >= length)) {
        throw new IndexError(index, length)
      }
    }
}