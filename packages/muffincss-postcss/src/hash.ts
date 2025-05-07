import MurmurHash3 from 'murmurhash3js';

export function getCompressedUniqueHash(cssString: string): string {
    return `m-${MurmurHash3.x86.hash32(cssString).toString(16)}` ; 

}