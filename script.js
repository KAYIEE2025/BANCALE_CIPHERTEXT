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
        this.symToNum = this._reverseMapping(this.numToSym);
    }

    _reverseMapping(mapping) {
        return Object.fromEntries(
            Object.entries(mapping).map(([key, value]) => [value, key])
        );
    }

    _validateInput(input, operation) {
        if (!input || typeof input !== 'string') {
            throw new Error(`Invalid input for ${operation}: input must be a non-empty string`);
        }

        if (input.trim() === "") {
            throw new Error(`Please enter a message to ${operation}.`);
        }
    }

    _encryptChar(char) {
        if (this.NORMAL.includes(char)) {
            const index = this.NORMAL.indexOf(char);
            const substituted = this.TUBIGON[index];
            const shiftedIndex = (this.TUBIGON.indexOf(substituted) + this.SHIFT) % 26;
            return this.TUBIGON[shiftedIndex];
        }
        return this.numToSym[char] || char;
    }

    _decryptChar(char) {
        if (this.symToNum[char]) {
            return this.symToNum[char];
        }
        if (this.TUBIGON.includes(char)) {
            const shiftedIndex = (this.TUBIGON.indexOf(char) - this.SHIFT + 26) % 26;
            const substituted = this.TUBIGON[shiftedIndex];
            const originalIndex = this.TUBIGON.indexOf(substituted);
            return this.NORMAL[originalIndex];
        }
        return char;
    }

    encrypt(text) {
        try {
            this._validateInput(text, 'encryption');
            const upperText = text.toUpperCase();
            return Array.from(upperText, char => this._encryptChar(char)).join('');
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    decrypt(text) {
        try {
            this._validateInput(text, 'decryption');
            const upperText = text.toUpperCase();
            return Array.from(upperText, char => this._decryptChar(char)).join('');
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
}

// Sound System
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playEncryptSound() {
        this.playTone(800, 0.1);
        setTimeout(() => this.playTone(1000, 0.1), 50);
        setTimeout(() => this.playTone(1200, 0.1), 100);
    }

    playDecryptSound() {
        this.playTone(1200, 0.1);
        setTimeout(() => this.playTone(1000, 0.1), 50);
        setTimeout(() => this.playTone(800, 0.1), 100);
    }

    playClickSound() {
        this.playTone(600, 0.05);
    }

    playSuccessSound() {
        this.playTone(400, 0.1);
        setTimeout(() => this.playTone(600, 0.1), 50);
        setTimeout(() => this.playTone(800, 0.15), 100);
    }

    playErrorSound() {
        this.playTone(300, 0.2, 'sawtooth');
    }
}

// Haptic Feedback System
class HapticSystem {
    constructor() {
        this.enabled = 'vibrate' in navigator;
    }

    vibrate(pattern) {
        if (this.enabled) {
            navigator.vibrate(pattern);
        }
    }

    lightVibrate() {
        this.vibrate(10);
    }

    mediumVibrate() {
        this.vibrate([20, 10, 20]);
    }

    strongVibrate() {
        this.vibrate([50, 30, 50, 30, 50]);
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'particles';
        document.body.appendChild(this.container);
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 500);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        
        this.container.appendChild(particle);
        this.particles.push(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }, 20000);
    }

    burst(x, y) {
        for (let i = 0; i < 10; i++) {
            const burst = document.createElement('div');
            burst.style.position = 'fixed';
            burst.style.left = x + 'px';
            burst.style.top = y + 'px';
            burst.style.width = '3px';
            burst.style.height = '3px';
            burst.style.background = '#00d4ff';
            burst.style.borderRadius = '50%';
            burst.style.pointerEvents = 'none';
            burst.style.zIndex = '9999';
            
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 3 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(burst);
            
            let opacity = 1;
            let posX = x;
            let posY = y;
            
            const animate = () => {
                posX += vx;
                posY += vy;
                opacity -= 0.03;
                
                burst.style.left = posX + 'px';
                burst.style.top = posY + 'px';
                burst.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(burst);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

// Cipher Visualization
class CipherVisualizer {
    constructor() {
        this.isActive = false;
    }

    async visualizeEncryption(text, result) {
        if (this.isActive) return;
        this.isActive = true;

        const inputElement = document.getElementById("inputText");
        const outputElement = document.getElementById("outputText");
        
        // Clear output with typing effect
        outputElement.value = '';
        await this.typeText(result, outputElement);
        
        this.isActive = false;
    }

    async visualizeDecryption(text, result) {
        if (this.isActive) return;
        this.isActive = true;

        const inputElement = document.getElementById("inputText");
        const outputElement = document.getElementById("outputText");
        
        // Clear output with typing effect
        outputElement.value = '';
        await this.typeText(result, outputElement);
        
        this.isActive = false;
    }

    async typeText(text, element) {
        for (let i = 0; i < text.length; i++) {
            element.value += text[i];
            await this.delay(30);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* ===================== UI CONTROLLER ===================== */

// Initialize cipher instance and systems
const cipher = new TubigonCipher();
const soundSystem = new SoundSystem();
const hapticSystem = new HapticSystem();
const particleSystem = new ParticleSystem();
const visualizer = new CipherVisualizer();

class UIController {
    static showMessage(message, type = 'error') {
        if (type === 'error') {
            this.showError(message);
        } else if (type === 'success') {
            this.showSuccess(message);
        }
    }

    static showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f56565, #e53e3e);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px solid #fc8181;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 30px rgba(245, 101, 101, 0.4);
        `;
        
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    static showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #68d391, #48bb78);
            color: #0a0e1a;
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px solid #9ae6b4;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 30px rgba(104, 211, 145, 0.4);
        `;
        
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 2000);
    }

    static getInput() {
        return document.getElementById("inputText").value;
    }

    static async setOutput(text, isEncryption = false) {
        const outputElement = document.getElementById("outputText");
        
        if (isEncryption) {
            await visualizer.visualizeEncryption(this.getInput(), text);
        } else {
            await visualizer.visualizeDecryption(this.getInput(), text);
        }
    }

    static setLoading(isLoading) {
        document.querySelectorAll('.button-group button').forEach(btn => {
            btn.disabled = isLoading;
            btn.style.opacity = isLoading ? '0.6' : '1';
        });
    }

    static createButtonBurst(event) {
        const rect = event.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        particleSystem.burst(x, y);
    }
}

/* ===================== EVENT HANDLERS ===================== */

async function encrypt(event) {
    try {
        if (event) {
            UIController.createButtonBurst(event);
            soundSystem.playClickSound();
            hapticSystem.lightVibrate();
        }
        UIController.setLoading(true);
        const input = UIController.getInput();
        const result = cipher.encrypt(input);
        await UIController.setOutput(result, true);
        soundSystem.playEncryptSound();
        hapticSystem.mediumVibrate();
        UIController.showMessage('Message encrypted successfully!', 'success');
        soundSystem.playSuccessSound();
    } catch (err) {
        soundSystem.playErrorSound();
        hapticSystem.strongVibrate();
        UIController.showMessage(err.message);
    } finally {
        UIController.setLoading(false);
    }
}

async function decrypt(event) {
    try {
        if (event) {
            UIController.createButtonBurst(event);
            soundSystem.playClickSound();
            hapticSystem.lightVibrate();
        }
        UIController.setLoading(true);
        const input = UIController.getInput();
        const result = cipher.decrypt(input);
        await UIController.setOutput(result, false);
        soundSystem.playDecryptSound();
        hapticSystem.mediumVibrate();
        UIController.showMessage('Message decrypted successfully!', 'success');
        soundSystem.playSuccessSound();
    } catch (err) {
        soundSystem.playErrorSound();
        hapticSystem.strongVibrate();
        UIController.showMessage(err.message);
    } finally {
        UIController.setLoading(false);
    }
}

/* ===================== TOGGLES ===================== */

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

/* ===================== INITIALIZATION ===================== */

document.addEventListener('DOMContentLoaded', () => {
    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            encrypt();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            decrypt();
        }
    });

    // Enhanced copy to clipboard with particle effect
    const output = document.getElementById("outputText");
    output.addEventListener('click', (e) => {
        if (output.value) {
            navigator.clipboard.writeText(output.value);
            UIController.showMessage('Copied to clipboard!', 'success');
            UIController.createButtonBurst(e);
        }
    });

    // Add hover effects to buttons (reduced frequency)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            // Create mini burst on hover (less frequent)
            if (Math.random() > 0.5) {
                particleSystem.burst(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10);
            }
        });
    });

    // Add typing effect to input field (reduced frequency)
    const input = document.getElementById("inputText");
    input.addEventListener('input', (e) => {
        // Create subtle particles while typing (much less frequent)
        if (Math.random() > 0.9) {
            const rect = e.target.getBoundingClientRect();
            particleSystem.burst(
                rect.left + Math.random() * rect.width,
                rect.top + rect.height / 2
            );
        }
    });

    // Initialize with a welcome burst
    setTimeout(() => {
        const container = document.querySelector('.container');
        const rect = container.getBoundingClientRect();
        particleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }, 500);
});
