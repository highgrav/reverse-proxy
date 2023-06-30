
const BitVector = require('./BitVector');

class BloomFilter {
    constructor(size, hashes){
        this.size = size;
        this.hashCount = hashes;
        this.bits = new BitVector(this.size);
    }

    hashFnv32(value, seed){
        let i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;
        for(let i = 0, l = value.length; i < l; i++){
            hval ^= value.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return hval >>> 0;
    }

    hashFnv64(value){
        let h1 = this.hashFnv32(value);
        return h1 + this.hashFnv32(h1 + value);
    }

    hash(value){
        let ret = [];
        let lastHash = undefined;
        for(let i = 0; i < this.hashCount; i++){
            if(lastHash !== undefined){
                value = value + " " + lastHash;
            }
            lastHash = this.hashFnv64(value);
            ret.push((lastHash % this.size) - 1);
        }
        return ret;
    }

    remember(value){
        let h = this.hash(value);
        for(let i = 0; i < h.length; i++){
            this.bits.set(h[i]);
        }
    }

    forget(value){
        let h = this.hash(value);
        for(let i = 0; i < h.length; i++){
            this.bits.unset(h[i]);
        }
    }

    contains(value){
        let h = this.hash(value);
        for(let i = 0; i < h.length; i++){
            if(this.bits.get(h[i]) == false){
                return false;
            }
        }
        return true;
    }
}

module.exports = BloomFilter;