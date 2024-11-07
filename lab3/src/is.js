// A module for checks
import  Matrix  from './Matrix.js'

export const isArray = Array.isArray

export function isNumber(x) {
    return typeof x === 'number';
}

export const isInteger = Number.isInteger

export function isMatrix (x) {
    return x instanceof Matrix
}

export function isZero (x) {
    if (isNumber(x)) {
        return x === 0
    } else if (isMatrix(x)) {
        return x.data.every(isZero)
    } else if (isArray(x)) {
        return x.every(isZero)
    } else {
        throw new TypeError('Unsupported type of data (' + typeof(x) + ')')
    }
}