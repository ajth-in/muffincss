const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = characters.length;

// Map to store hash -> original string
const hashMap = new Map<string, string>();
// Reverse map to quickly check if a string is already assigned a hash
const reverseMap = new Map<string, string>();

// Generator to iterate hashes in increasing length: '0', '1', ..., 'Z', '00', '01', ...
function* hashGenerator(): Generator<string> {
    let length = 1;
    while (true) {
        const max = Math.pow(base, length);
        for (let i = 0; i < max; i++) {
            yield encodeBase62(i, length);
        }
        length++;
    }
}

// Encode number to base62 with fixed length
function encodeBase62(num: number, length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result = characters[num % base] + result;
        num = Math.floor(num / base);
    }
    return result;
}

// Main function to get compressed unique hash
export function getCompressedUniqueHash(input: string): string {
    // Return cached value if already hashed
    if (reverseMap.has(input)) return reverseMap.get(input)!;

    const gen = hashGenerator();

    for (const candidate of gen) {
        if (!hashMap.has(candidate)) {
            hashMap.set(candidate, input);
            reverseMap.set(input, candidate);
            return candidate;
        }
    }

    throw new Error("Ran out of hashes (this should never happen)");
}

