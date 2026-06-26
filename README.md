# Abuse Resistant OTP System

## Tech Stack

- Node.js
- Express.js
- bcryptjs
- crypto module

---

## Features

- Secure 6-digit OTP generation
- OTP hashing using bcrypt
- OTP expiry after 10 minutes
- OTP invalidation after successful verification
- Brute-force protection
- Send rate limiting
- Session token generation

---

## Setup Instructions

### Install dependencies

```bash
npm install
```

### Run server

```bash
npm start
```

Server runs on:

```txt
http://localhost:3000
```

---

## API Endpoints

### Send OTP

POST `/auth/send`

Request:

```json
{
  "identifier": "test@gmail.com"
}
```

---

### Verify OTP

POST `/auth/verify`

Request:

```json
{
  "identifier": "test@gmail.com",
  "code": "123456"
}
```

---

## Security Implementation

### CSPRNG

OTP generation uses:

```javascript
crypto.randomInt()
```

from Node.js crypto module for cryptographically secure random number generation.

---

### Hashing

OTPs are hashed using bcrypt before storage.

Plaintext OTPs are never stored.

---

### Rate Limiting

- Maximum 3 OTP send requests per identifier in 10 minutes
- Maximum 5 incorrect verification attempts

---

### OTP Expiry

OTPs expire after 10 minutes.

---

### OTP Reuse Protection

OTP is immediately invalidated after successful verification.

---

## Threat Model

If the OTP storage is leaked, attackers can access:

- identifiers
- timestamps
- hashed OTP values

Attackers cannot directly recover plaintext OTPs because bcrypt hashing is one-way.

---

## Development Note

OTP is logged to console during development instead of sending via email or SMS.