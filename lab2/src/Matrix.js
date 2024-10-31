import { isArray } from "./is.js";
import { clone } from "./object.js";
import { arraySize, validate, get } from "./array.js";

class Matrix{
    #data;
    #size;
    constructor(data){
        if(isArray(data)){
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
}

export default Matrix
