/**
 * Tubigon Pattern-Key Cipher System (TPKC)
 * Custom non-Caesar cipher using pattern-based multiplication
 * IAS 101 – Educational Purpose
 */

class TubigonPatternCipher {
    constructor() {
        this.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        // 🔑 Secret pattern key (can be changed)
        this.PATTERN_KEY = [3, 1, 4, 2];
    }

    /* ================= CORE UTILITIES ================= */

    letterToNumber(letter) {
        return this.ALPHABET.indexOf(letter) + 1;
    }

    numberToLetter(number) {
        return this.ALPHABET[(number - 1 + 26) % 26];
    }

    modularInverse(a, mod = 26) {
        for (let i = 1; i < mod; i++) {
            if ((a * i) % mod === 1) return i;
        }
        return 1; // safe fallback
    }

    validateInput(text, action) {
        if (!text || typeof text !== "string" || text.trim() === "") {
            throw new Error(`Please enter a message to ${action}.`);
        }
    }

    /* ================= ENCRYPTION ================= */

    encrypt(text) {
        this.validateInput(text, "encrypt");
        text = text.toUpperCase();

        let result = "";
        let keyIndex = 0;

        for (let char of text) {
            if (this.ALPHABET.includes(char)) {
                const letterValue = this.letterToNumber(char);
                const key = this.PATTERN_KEY[keyIndex % this.PATTERN_KEY.length];

                let encryptedValue = (letterValue * key) % 26;
                if (encryptedValue === 0) encryptedValue = 26;

                result += this.numberToLetter(encryptedValue);
                keyIndex++;
            } else {
                result += char; // keep spaces & symbols
            }
        }
        return result;
    }

    /* ================= DECRYPTION ================= */

    decrypt(text) {
        this.validateInput(text, "decrypt");
        text = text.toUpperCase();

        let result = "";
        let keyIndex = 0;

        for (let char of text) {
            if (this.ALPHABET.includes(char)) {
                const cipherValue = this.letterToNumber(char);
                const key = this.PATTERN_KEY[keyIndex % this.PATTERN_KEY.length];
                const inverseKey = this.modularInverse(key);

                let decryptedValue = (cipherValue * inverseKey) % 26;
                if (decryptedValue === 0) decryptedValue = 26;

                result += this.numberToLetter(decryptedValue);
                keyIndex++;
            } else {
                result += char;
            }
        }
        return result;
    }
}

/* ================= INITIALIZATION ================= */

const cipher = new TubigonPatternCipher();

/* ================= UI HANDLERS ================= */

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
        const input = document.getElementById("inputText").value;
        document.getElementById("outputText").value = cipher.decrypt(input);
    } catch (err) {
        alert(err.message);
    }
}

/* ================= INFO TOGGLES ================= */

function toggleGuide() {
    const guide = document.getElementById("guide");
    const button = document.querySelector('button[aria-controls="guide"]');
    const hidden = guide.classList.toggle("hidden");
    button.setAttribute("aria-expanded", !hidden);
}

function toggleKey() {
    const keyInfo = document.getElementById("keyInfo");
    const button = document.querySelector('button[aria-controls="keyInfo"]');
    const hidden = keyInfo.classList.toggle("hidden");
    button.setAttribute("aria-expanded", !hidden);
}
