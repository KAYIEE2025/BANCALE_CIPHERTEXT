/**
 * Tubigon Pattern-Key Cipher System (TPKC)
 * Fully reversible non-Caesar cipher
 * IAS 101 – Educational Purpose
 */

class TubigonPatternCipher {
    constructor() {
        this.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        // ✅ ALL values are coprime with 26
        this.PATTERN_KEY = [3, 5, 7, 11];
    }

    /* ============ CORE UTILITIES ============ */

    letterToNumber(letter) {
        return this.ALPHABET.indexOf(letter); // A=0 ... Z=25
    }

    numberToLetter(number) {
        return this.ALPHABET[(number + 26) % 26];
    }

    modularInverse(a, mod = 26) {
        for (let i = 1; i < mod; i++) {
            if ((a * i) % mod === 1) return i;
        }
        throw new Error(`Invalid key ${a}: no modular inverse modulo 26`);
    }

    validateInput(text, action) {
        if (!text || typeof text !== "string" || text.trim() === "") {
            throw new Error(`Please enter a message to ${action}.`);
        }
    }

    /* ============ ENCRYPTION ============ */

    encrypt(text) {
        this.validateInput(text, "encrypt");
        text = text.toUpperCase();

        let result = "";
        let keyIndex = 0;

        for (let char of text) {
            if (this.ALPHABET.includes(char)) {
                const p = this.letterToNumber(char);
                const key = this.PATTERN_KEY[keyIndex % this.PATTERN_KEY.length];

                const c = (p * key) % 26;
                result += this.numberToLetter(c);

                keyIndex++;
            } else {
                result += char;
            }
        }
        return result;
    }

    /* ============ DECRYPTION ============ */

    decrypt(text) {
        this.validateInput(text, "decrypt");
        text = text.toUpperCase();

        let result = "";
        let keyIndex = 0;

        for (let char of text) {
            if (this.ALPHABET.includes(char)) {
                const c = this.letterToNumber(char);
                const key = this.PATTERN_KEY[keyIndex % this.PATTERN_KEY.length];
                const inv = this.modularInverse(key);

                const p = (c * inv) % 26;
                result += this.numberToLetter(p);

                keyIndex++;
            } else {
                result += char;
            }
        }
        return result;
    }
}

/* ============ INITIALIZATION ============ */

const cipher = new TubigonPatternCipher();

/* ============ UI HANDLERS ============ */

function encrypt() {
    try {
        const input = document.getElementById("inputText").value;
        document.getElementById("outputText").value = cipher.encrypt(input);
    } catch (err) {
        alert(err.message);
    }
}

function decrypt() {
    try {
        const input = document.getElementById("outputText").value;
        document.getElementById("outputText").value = cipher.decrypt(input);
    } catch (err) {
        alert(err.message);
    }
}
