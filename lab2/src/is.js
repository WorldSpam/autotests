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