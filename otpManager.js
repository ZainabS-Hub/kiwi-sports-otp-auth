/**
 * One-Time Passcode (OTP) Authentication System
 * Kiwi Sports Apparel - Multi-Factor Authentication Solution
 * 
 * Purpose: Provides an additional layer of security for user login by managing
 * time-limited one-time passcodes with automatic expiration.
 * 
 * @author Your Name
 * @date 2025-11-07
 */

/**
 * OTPManager Class
 * Manages one-time passcodes with expiration functionality
 */
class OTPManager {
    /**
     * Constructor initializes the passcode storage
     * Uses a Map for efficient key-value pair management
     */
    constructor() {
        // Store passcodes with their expiration timestamps
        this.passcodes = new Map();
        
        // Default duration: 5 minutes (300,000 milliseconds)
        this.DEFAULT_DURATION = 5 * 60 * 1000;
    }

    /**
     * Generates and stores a one-time passcode with expiration
     * 
     * @param {number} passcode - The integer passcode (one-time code for login)
     * @param {number} duration - Duration in milliseconds (default: 5 minutes)
     * @returns {boolean} - true if passcode already existed, false if newly created
     * 
     * Requirements met:
     * - Accepts integer passcode and duration in milliseconds
     * - 5-minute duration limit
     * - Returns true if unexpired passcode exists, false otherwise
     * - Overwrites duration if key already exists
     */
    generateOTP(passcode, duration = this.DEFAULT_DURATION) {
        // Validate passcode is an integer
        if (!Number.isInteger(passcode)) {
            throw new Error("Passcode must be an integer");
        }

        // Validate duration is positive
        if (duration <= 0) {
            throw new Error("Duration must be a positive number");
        }

        // Limit duration to maximum 5 minutes as per requirements
        const maxDuration = 5 * 60 * 1000;
        const effectiveDuration = Math.min(duration, maxDuration);

        // Check if passcode already exists and is still valid
        const existingPasscode = this.passcodes.get(passcode);
        const passcodeExists = existingPasscode && existingPasscode.expiresAt > Date.now();

        // Calculate expiration timestamp
        const expiresAt = Date.now() + effectiveDuration;

        // Store or update passcode with expiration time
        this.passcodes.set(passcode, {
            createdAt: Date.now(),
            expiresAt: expiresAt,
            duration: effectiveDuration
        });

        // Set automatic cleanup when passcode expires
        this.scheduleCleanup(passcode, effectiveDuration);

        // Return true if passcode existed and was valid, false if new
        return passcodeExists;
    }

    /**
     * Validates if a passcode is currently valid and accessible
     * 
     * @param {number} passcode - The passcode to verify
     * @returns {boolean} - true if valid and not expired, false otherwise
     * 
     * Requirements met:
     * - Passcode becomes inaccessible after duration elapsed
     */
    verifyOTP(passcode) {
        const storedPasscode = this.passcodes.get(passcode);

        // Check if passcode exists
        if (!storedPasscode) {
            return false;
        }

        // Check if passcode has expired
        if (storedPasscode.expiresAt <= Date.now()) {
            // Remove expired passcode
            this.passcodes.delete(passcode);
            return false;
        }

        return true;
    }

    /**
     * Consumes (uses and removes) a one-time passcode
     * 
     * @param {number} passcode - The passcode to consume
     * @returns {boolean} - true if successfully consumed, false if invalid/expired
     */
    consumeOTP(passcode) {
        // Verify passcode is valid
        if (this.verifyOTP(passcode)) {
            // Remove passcode after successful use (one-time use)
            this.passcodes.delete(passcode);
            return true;
        }
        return false;
    }

    /**
     * Gets remaining time for a passcode in milliseconds
     * 
     * @param {number} passcode - The passcode to check
     * @returns {number} - Remaining time in milliseconds, or 0 if expired/invalid
     */
    getRemainingTime(passcode) {
        const storedPasscode = this.passcodes.get(passcode);

        if (!storedPasscode) {
            return 0;
        }

        const remaining = storedPasscode.expiresAt - Date.now();
        return remaining > 0 ? remaining : 0;
    }

    /**
     * Schedules automatic cleanup of expired passcode
     * 
     * @param {number} passcode - The passcode to clean up
     * @param {number} duration - Duration in milliseconds
     * @private
     */
    scheduleCleanup(passcode, duration) {
        setTimeout(() => {
            // Remove expired passcode
            if (this.passcodes.has(passcode)) {
                const storedPasscode = this.passcodes.get(passcode);
                if (storedPasscode.expiresAt <= Date.now()) {
                    this.passcodes.delete(passcode);
                }
            }
        }, duration);
    }

    /**
     * Clears all expired passcodes manually
     * 
     * @returns {number} - Number of passcodes removed
     */
    cleanupExpired() {
        let removed = 0;
        const now = Date.now();

        for (const [passcode, data] of this.passcodes.entries()) {
            if (data.expiresAt <= now) {
                this.passcodes.delete(passcode);
                removed++;
            }
        }

        return removed;
    }

    /**
     * Gets the total number of active (non-expired) passcodes
     * 
     * @returns {number} - Count of active passcodes
     */
    getActiveCount() {
        this.cleanupExpired();
        return this.passcodes.size;
    }

    /**
     * Clears all passcodes (for testing or reset purposes)
     */
    clearAll() {
        this.passcodes.clear();
    }
}

// ============================================================================
// USAGE EXAMPLES AND DEMONSTRATION
// ============================================================================

/**
 * Example 1: Basic OTP Generation and Verification
 */
function exampleBasicUsage() {
    console.log("=== Example 1: Basic OTP Usage ===");
    
    const otpManager = new OTPManager();
    
    // Generate a new OTP with 5-minute duration
    const passcode = 123456;
    const existed = otpManager.generateOTP(passcode);
    
    console.log(`Passcode ${passcode} generated. Already existed: ${existed}`);
    console.log(`Is valid: ${otpManager.verifyOTP(passcode)}`);
    console.log(`Remaining time: ${otpManager.getRemainingTime(passcode)}ms`);
}

/**
 * Example 2: Overwriting Existing Passcode Duration
 */
function exampleOverwrite() {
    console.log("\n=== Example 2: Overwriting Duration ===");
    
    const otpManager = new OTPManager();
    const passcode = 789012;
    
    // First generation
    let existed = otpManager.generateOTP(passcode, 60000); // 1 minute
    console.log(`First generation - Already existed: ${existed}`);
    
    // Second generation (overwrites duration)
    existed = otpManager.generateOTP(passcode, 120000); // 2 minutes
    console.log(`Second generation - Already existed: ${existed}`);
}

/**
 * Example 3: Passcode Expiration
 */
async function exampleExpiration() {
    console.log("\n=== Example 3: Passcode Expiration ===");
    
    const otpManager = new OTPManager();
    const passcode = 111222;
    
    // Generate with 2-second duration for testing
    otpManager.generateOTP(passcode, 2000);
    console.log(`Initial validity: ${otpManager.verifyOTP(passcode)}`);
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log(`After expiration: ${otpManager.verifyOTP(passcode)}`);
}

/**
 * Example 4: One-Time Use (Consume OTP)
 */
function exampleConsume() {
    console.log("\n=== Example 4: One-Time Consumption ===");
    
    const otpManager = new OTPManager();
    const passcode = 333444;
    
    otpManager.generateOTP(passcode);
    console.log(`Before consumption: ${otpManager.verifyOTP(passcode)}`);
    
    const consumed = otpManager.consumeOTP(passcode);
    console.log(`Consumed successfully: ${consumed}`);
    console.log(`After consumption: ${otpManager.verifyOTP(passcode)}`);
}

// ============================================================================
// INTEGRATION EXAMPLE FOR KIWI SPORTS APPAREL WEB APPLICATION
// ============================================================================

/**
 * Login flow integration example
 * Demonstrates how this OTP system integrates with the existing login process
 */
class KiwiSportsAuth {
    constructor() {
        this.otpManager = new OTPManager();
        this.users = new Map(); // Simulated user database
    }

    /**
     * Step 1: User requests OTP after entering username/password
     */
    requestOTP(userId) {
        // Generate random 6-digit passcode
        const passcode = Math.floor(100000 + Math.random() * 900000);
        
        // Store OTP with 5-minute expiration
        this.otpManager.generateOTP(passcode);
        
        // In production, send this via email/SMS to user
        console.log(`OTP ${passcode} sent to user ${userId}`);
        
        return passcode; // Only for demo; don't return in production!
    }

    /**
     * Step 2: User submits OTP to complete login
     */
    verifyAndLogin(userId, passcode) {
        // Verify OTP is valid
        if (!this.otpManager.verifyOTP(passcode)) {
            return {
                success: false,
                message: "Invalid or expired OTP"
            };
        }

        // Consume OTP (one-time use)
        const consumed = this.otpManager.consumeOTP(passcode);
        
        if (consumed) {
            // Grant access to user
            return {
                success: true,
                message: "Login successful",
                sessionToken: this.generateSessionToken(userId)
            };
        }

        return {
            success: false,
            message: "OTP verification failed"
        };
    }

    generateSessionToken(userId) {
        return `session_${userId}_${Date.now()}`;
    }
}

/**
 * Demonstration of complete authentication flow
 */
function demonstrateAuthFlow() {
    console.log("\n=== Kiwi Sports Apparel Authentication Flow ===");
    
    const auth = new KiwiSportsAuth();
    const userId = "user123";
    
    // User enters credentials and requests OTP
    const otp = auth.requestOTP(userId);
    
    // User receives OTP and submits it
    const result = auth.verifyAndLogin(userId, otp);
    console.log("Login result:", result);
}

// ============================================================================
// EXPORT FOR MODULE USAGE
// ============================================================================

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OTPManager, KiwiSportsAuth };
}

// For browser environments
if (typeof window !== 'undefined') {
    window.OTPManager = OTPManager;
    window.KiwiSportsAuth = KiwiSportsAuth;
}

// ============================================================================
// RUN EXAMPLES (Comment out in production)
// ============================================================================

// Uncomment to run examples:
// exampleBasicUsage();
// exampleOverwrite();
// exampleExpiration().then(() => console.log("Expiration test complete"));
// exampleConsume();
// demonstrateAuthFlow();