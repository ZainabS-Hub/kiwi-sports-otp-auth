# OTP Authentication System - Kiwi Sports Apparel

## Project Overview
A JavaScript-based One-Time Passcode (OTP) authentication system designed to enhance login security for the Kiwi Sports Apparel web application through multi-factor authentication.

## 📋 Table of Contents
- [Requirements](#requirements)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [How It Meets Client Requirements](#how-it-meets-client-requirements)

## 🎯 Requirements

### Client Requirements
- Generate key-value pairs (passcode and duration)
- Accept integer passcode and duration in milliseconds
- Limit passcode validity to 5 minutes maximum
- Make passcode inaccessible after duration expires
- Return `true` if unexpired passcode already exists, `false` otherwise
- Overwrite duration if passcode key already exists

### Technical Requirements
- Pure JavaScript (ES6+)
- No external dependencies
- Works in both Node.js and browser environments
- Comprehensive documentation

## ✨ Features

- **Time-Limited Passcodes**: Automatically expire after specified duration (max 5 minutes)
- **Duplicate Detection**: Returns `true` if active passcode already exists
- **Duration Override**: Updates expiration time for existing passcodes
- **Automatic Cleanup**: Self-cleaning expired passcodes
- **One-Time Use**: Consumes passcode after successful verification
- **Validation**: Input validation for passcode and duration parameters
- **Monitoring**: Track remaining time and active passcode count

## 🚀 Installation

### Option 1: Direct Download
Download `otpManager.js` and include it in your project:

```html
<!-- For browser -->
<script src="otpManager.js"></script>
```

```javascript
// For Node.js
const { OTPManager } = require('./otpManager.js');
```

### Option 2: Clone Repository
```bash
git clone https://github.com/yourusername/kiwi-sports-otp-auth.git
cd kiwi-sports-otp-auth
```

## 📖 Usage

### Basic Usage

```javascript
// Create OTP Manager instance
const otpManager = new OTPManager();

// Generate OTP with default 5-minute duration
const passcode = 123456;
const existed = otpManager.generateOTP(passcode);
console.log(`Already existed: ${existed}`); // false

// Verify OTP is valid
const isValid = otpManager.verifyOTP(passcode);
console.log(`Is valid: ${isValid}`); // true

// Consume OTP (one-time use)
const consumed = otpManager.consumeOTP(passcode);
console.log(`Consumed: ${consumed}`); // true
```

### Custom Duration

```javascript
const otpManager = new OTPManager();

// Generate OTP with 2-minute duration (120,000 ms)
const passcode = 789012;
otpManager.generateOTP(passcode, 120000);

// Check remaining time
const remaining = otpManager.getRemainingTime(passcode);
console.log(`Time remaining: ${remaining}ms`);
```

### Overwriting Duration

```javascript
const otpManager = new OTPManager();
const passcode = 555666;

// First generation
let existed = otpManager.generateOTP(passcode, 60000); // 1 minute
console.log(existed); // false

// Overwrite with new duration
existed = otpManager.generateOTP(passcode, 180000); // 3 minutes
console.log(existed); // true (passcode already existed)
```

### Integration Example

```javascript
class LoginSystem {
  constructor() {
    this.otpManager = new OTPManager();
  }

  // Step 1: Generate and send OTP
  sendOTP(userId) {
    const passcode = Math.floor(100000 + Math.random() * 900000);
    this.otpManager.generateOTP(passcode);
    
    // Send passcode via email/SMS
    this.sendEmail(userId, passcode);
    
    return true;
  }

  // Step 2: Verify OTP during login
  verifyLogin(userId, passcode) {
    if (this.otpManager.consumeOTP(passcode)) {
      return { success: true, token: this.createSession(userId) };
    }
    return { success: false, error: "Invalid or expired OTP" };
  }
}
```

## 📚 API Documentation

### OTPManager Class

#### Constructor
```javascript
const otpManager = new OTPManager();
```
Creates a new OTP manager instance.

#### Methods

##### `generateOTP(passcode, duration)`
Generates or updates a one-time passcode.

**Parameters:**
- `passcode` (number): Integer passcode
- `duration` (number, optional): Duration in milliseconds (default: 300000 = 5 minutes)

**Returns:** `boolean`
- `true`: Passcode already existed and was valid
- `false`: New passcode created

**Throws:** Error if passcode is not an integer or duration is not positive

**Example:**
```javascript
const existed = otpManager.generateOTP(123456, 180000);
```

##### `verifyOTP(passcode)`
Checks if a passcode is valid and not expired.

**Parameters:**
- `passcode` (number): Passcode to verify

**Returns:** `boolean`
- `true`: Passcode is valid
- `false`: Passcode is invalid or expired

**Example:**
```javascript
const isValid = otpManager.verifyOTP(123456);
```

##### `consumeOTP(passcode)`
Verifies and removes a passcode (one-time use).

**Parameters:**
- `passcode` (number): Passcode to consume

**Returns:** `boolean`
- `true`: Passcode was valid and consumed
- `false`: Passcode was invalid or expired

**Example:**
```javascript
const success = otpManager.consumeOTP(123456);
```

##### `getRemainingTime(passcode)`
Gets remaining validity time for a passcode.

**Parameters:**
- `passcode` (number): Passcode to check

**Returns:** `number` - Remaining time in milliseconds (0 if expired/invalid)

**Example:**
```javascript
const remaining = otpManager.getRemainingTime(123456);
console.log(`${Math.floor(remaining / 1000)} seconds remaining`);
```

##### `getActiveCount()`
Returns the number of active (non-expired) passcodes.

**Returns:** `number`

**Example:**
```javascript
const count = otpManager.getActiveCount();
```

##### `cleanupExpired()`
Manually removes all expired passcodes.

**Returns:** `number` - Count of removed passcodes

**Example:**
```javascript
const removed = otpManager.cleanupExpired();
```

##### `clearAll()`
Removes all passcodes (for testing/reset).

**Example:**
```javascript
otpManager.clearAll();
```

## 🧪 Testing

### Manual Testing

Run the included examples:

```javascript
// Uncomment in the code file:
exampleBasicUsage();
exampleOverwrite();
exampleExpiration();
exampleConsume();
demonstrateAuthFlow();
```

### Test Cases

1. **Test: Generate New OTP**
   - Input: `generateOTP(123456)`
   - Expected: Returns `false` (new passcode)

2. **Test: Duplicate OTP**
   - Input: `generateOTP(123456)` twice
   - Expected: Second call returns `true`

3. **Test: Verify Valid OTP**
   - Input: Generate OTP, then `verifyOTP(123456)`
   - Expected: Returns `true`

4. **Test: Expired OTP**
   - Input: Generate with 1-second duration, wait 2 seconds, verify
   - Expected: Returns `false`

5. **Test: Duration Override**
   - Input: Generate with 60s, then generate same passcode with 120s
   - Expected: Duration updated, returns `true`

6. **Test: One-Time Use**
   - Input: `consumeOTP(123456)` twice
   - Expected: First returns `true`, second returns `false`

7. **Test: Maximum Duration**
   - Input: `generateOTP(123456, 600000)` (10 minutes)
   - Expected: Capped at 5 minutes (300000ms)

## ✅ How It Meets Client Requirements

### Summary (100 words)

The OTP Authentication System successfully addresses Kiwi Sports Apparel's security requirements by implementing a robust multi-factor authentication layer. The `OTPManager` class provides a complete solution with key-value pair management, accepting integer passcodes with configurable durations limited to 5 minutes. Expired passcodes automatically become inaccessible through scheduled cleanup. The system returns boolean values indicating passcode existence status and overwrites durations for existing keys as specified. Comprehensive documentation, error handling, and integration examples ensure seamless deployment into the existing web application, significantly enhancing login security through time-limited one-time passcodes.

### Detailed Requirements Mapping

| Requirement | Implementation | Status |
|------------|----------------|---------|
| Accept integer passcode and duration | `generateOTP(passcode, duration)` method with parameter validation | ✅ |
| 5-minute duration limit | `Math.min(duration, maxDuration)` caps at 300,000ms | ✅ |
| Inaccessible after expiration | `verifyOTP()` checks timestamp; auto-cleanup removes expired codes | ✅ |
| Return true if exists, false if new | Checks existing valid passcode before storing | ✅ |
| Overwrite duration if exists | Updates expiration timestamp for existing passcodes | ✅ |
| Generate key-value pairs | Map structure stores passcode (key) with expiration data (value) | ✅ |

## 🏗️ Architecture

### Class Structure
```
OTPManager
├── Constructor
│   ├── passcodes (Map)
│   └── DEFAULT_DURATION
├── Public Methods
│   ├── generateOTP()
│   ├── verifyOTP()
│   ├── consumeOTP()
│   ├── getRemainingTime()
│   ├── getActiveCount()
│   ├── cleanupExpired()
│   └── clearAll()
└── Private Methods
    └── scheduleCleanup()
```

### Data Structure
```javascript
passcodes: Map {
  passcode (number) => {
    createdAt: timestamp,
    expiresAt: timestamp,
    duration: milliseconds
  }
}
```

## 🔒 Security Considerations

1. **One-Time Use**: Passcodes are consumed after successful verification
2. **Automatic Expiration**: Time-limited validity prevents replay attacks
3. **Secure Generation**: In production, use cryptographically secure random generation
4. **Rate Limiting**: Implement additional rate limiting on OTP generation
5. **Transmission Security**: Send OTPs via secure channels (HTTPS, encrypted email/SMS)

## 📝 License

This project is developed for Kiwi Sports Apparel as part of the IT security enhancement initiative.

## 👤 Author

**Your Name**
- Student ID: [Your ID]
- Course: Full Stack JavaScript Development
- Institution: Whitecliffe

## 📞 Support

For questions or clarifications, contact your micro-credential facilitator.

---

**Last Updated:** November 7, 2025
