// module to work with objects 
import { isArray } from "../src/is.js";

/**
 * Clone object. Can recursively clone nested arrays.
 * Basically a deep copy
 * @param {Object} x - object to clone
 * @returns 
 */
export function clone (x) {
    const type = typeof x
  
    // immutable primitive types
    if (type === 'number' || type === 'bigint' || type === 'string' || type === 'boolean' ||
        x === null || x === undefined) {
      return x
    }
  
    // use clone function of the object when available
    if (typeof x.clone === 'function') {
      return x.clone()
    }
  
    // array
    if (isArray(x)) {
      return x.map(function (value) {
        return clone(value)
      })
    }
    
    throw new TypeError(`Cannot clone: unknown type of value (value: ${x})`)
}