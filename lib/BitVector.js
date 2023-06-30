
// Basic class for arbitrary-length bitvectors.
class BitVector{
    BITS_PER_ELEMENT = 32;

    length = 0;
    elementCount = 0;
    vector = [];

    constructor(size){
        this.length = size;
        this.elementCount = Math.ceil(this.length / this.BITS_PER_ELEMENT);
        this.vector = new Array(this.elementCount);
        this.clear();
    }

    clear(){
        for(let i = 0; i < this.elementCount; i++){
            this.vector[i] = 0;
        }
    }

    set(i){
        let elemIdx = Math.floor(i / this.BITS_PER_ELEMENT);
        let bitIdx = i % this.BITS_PER_ELEMENT;
        this.vector[elemIdx] = this.vector[elemIdx] | (1 << bitIdx);
    }

    unset(i){
        let elemIdx = Math.floor(i / this.BITS_PER_ELEMENT);
        let bitIdx = i % this.BITS_PER_ELEMENT;
        this.vector[elemIdx] = this.vector[elemIdx] & ~(1 << bitIdx);
    }

    get(i){
        let elemIdx = Math.floor(i / this.BITS_PER_ELEMENT);
        let bitIdx = i % this.BITS_PER_ELEMENT;
        let val = this.vector[elemIdx] & (1 << bitIdx);
        return val != 0;
    }

    toByteArray(){
        return Buffer.from(this.vector);
    }
}

module.exports = BitVector;