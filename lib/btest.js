const BloomFilter = require('./BloomFilter');
const { contentSecurityPolicy } = require('helmet');

var bf = new BloomFilter(10000, 5);

const STRVAL = process.argv[2];

console.log(bf.hashFnv32(STRVAL));
console.log(bf.hashFnv64(STRVAL));
console.log(bf.hash(STRVAL));

bf.remember(STRVAL);
console.log(bf.contains(STRVAL));