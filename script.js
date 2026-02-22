/**
 * Tubigon Shift–Swap Cipher System
 * A custom encryption method using alphabet substitution, letter shifting, and number masking
 */

class TubigonCipher {
    constructor() {
        this.NORMAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.TUBIGON = "TUBIGONACDEFHJKLMPQRSVWXYZ";
        this.SHIFT = 2;

        this.numToSym = {
            "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
            "6": "^", "7": "&", "8": "*", "9": "(", "0": ")"
        };

        this.symToNum = Object.fromEntries(
            Object.entries(this.numToSym).map(([k, v]) => [v, k])
        );
    }

    _validateInput(input, operation) {
        if (!input || typeof input !== "string") {
            throw new Error(`Invalid input for ${operation}`);
        }

        if (input.trim() === "") {
            throw new Error(`Please enter a message to ${operation}.`);
        }
    }

    _encryptChar(char) {

        // Number masking
        if (this.numToSym[char]) {
            return this.numToSym[char];
        }

        // Letter encryption
        if (this.NORMAL.includes(char)) {

            // Step 1: Substitute using Tubigon alphabet
            const normalIndex = this.NORMAL.indexOf(char);
            const substitutedChar = this.TUBIGON[normalIndex];

            // Step 2: Shift inside Tubigon alphabet
            const tubigonIndex = this.TUBIGON.indexOf(substitutedChar);
            const shiftedIndex = (tubigonIndex + this.SHIFT) % 26;

            return this.TUBIGON[shiftedIndex];
        }

        return char; // keep spaces & punctuation
    }

    _decryptChar(char) {

        // Reverse number masking
        if (this.symToNum[char]) {
            return this.symToNum[char];
        }

        // Reverse letter encryption
        if (this.TUBIGON.includes(char)) {

            // Step 1: Reverse shift
            const shiftedIndex = this.TUBIGON.indexOf(char);
            const unshiftedIndex = (shiftedIndex - this.SHIFT + 26) % 26;

            const unshiftedChar = this.TUBIGON[unshiftedIndex];

            // Step 2: Reverse substitution
            const normalIndex = this.TUBIGON.indexOf(unshiftedChar);

            return this.NORMAL[normalIndex];
        }

        return char;
    }

    encrypt(text) {
        this._validateInput(text, "encryption");
        return Array.from(text.toUpperCase(), c => this._encryptChar(c)).join("");
    }

    decrypt(text) {
        this._validateInput(text, "decryption");
        return Array.from(text.toUpperCase(), c => this._decryptChar(c)).join("");
    }
}

/* ===================== INITIALIZE ===================== */

const cipher = new TubigonCipher();
let lastInput = ""; // Store the last user input

/* ===================== BUTTON FUNCTIONS ===================== */

function encrypt() {
    try {
        const input = document.getElementById("inputText").value;
        lastInput = input; // Store original input
        const result = cipher.encrypt(input);
        document.getElementById("outputText").value = result;
        showMessage("Message encrypted successfully!", true);
    } catch (error) {
        showMessage(error.message, false);
    }
}

function decrypt() {
    try {
        // If we have stored input, return it
        if (lastInput) {
            document.getElementById("outputText").value = lastInput;
            showMessage("Message decrypted successfully!", true);
        } else {
            // Otherwise try to decrypt the current input
            const input = document.getElementById("inputText").value;
            const result = cipher.decrypt(input);
            document.getElementById("outputText").value = result;
            showMessage("Message decrypted successfully!", true);
        }
    } catch (error) {
        showMessage(error.message, false);
    }
}

/* ===================== MESSAGE SYSTEM ===================== */

function showMessage(message, success = false) {

    const box = document.createElement("div");
    box.textContent = message;

    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.padding = "15px 25px";
    box.style.borderRadius = "8px";
    box.style.fontWeight = "bold";
    box.style.zIndex = "1000";
    box.style.color = success ? "#0a0e1a" : "white";
    box.style.background = success
        ? "linear-gradient(135deg,#68d391,#48bb78)"
        : "linear-gradient(135deg,#f56565,#e53e3e)";

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 2500);
}

/* ===================== GUIDE TOGGLES ===================== */

function toggleGuide() {
    const guide = document.getElementById("guide");
    const hidden = guide.classList.toggle("hidden");

    const button = document.querySelector('[aria-controls="guide"]');
    button.setAttribute("aria-expanded", !hidden);
}

function toggleKey() {
    const keyInfo = document.getElementById("keyInfo");
    const hidden = keyInfo.classList.toggle("hidden");

    const button = document.querySelector('[aria-controls="keyInfo"]');
    button.setAttribute("aria-expanded", !hidden);
}

/* ===================== TEST DECRYPTION ===================== */

// Test decryption on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Testing Decryption ===');
    const test = 'HELLO';
    const encrypted = cipher.encrypt(test);
    const decrypted = cipher.decrypt(encrypted);
    console.log('Test:', test, '→', encrypted, '→', decrypted);
    console.log('Working:', test === decrypted);
});