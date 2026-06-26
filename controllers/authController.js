const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/otp");
const generateSessionToken = require("../utils/token");
const canSendOTP = require("../utils/rateLimiter");

const { otpStore, sendRateLimit } = require("../data/store");

exports.sendOTP = async (req, res) => {
    const { identifier } = req.body;

    if (!identifier) {
        return res.status(400).json({
            message: "Identifier required"
        });
    }

    const allowed = canSendOTP(identifier, sendRateLimit);

    if (!allowed) {
        return res.status(429).json({
            message: "Too many OTP requests"
        });
    }

    const otp = generateOTP();

    console.log("OTP:", otp);

    const hashedOTP = await bcrypt.hash(otp, 10);

    otpStore[identifier] = {
        otpHash: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000,
        used: false,
        attempts: 0
    };

    return res.status(200).json({
        message: `OTP sent to ${identifier}`
    });
};

exports.verifyOTP = async (req, res) => {
    const { identifier, code } = req.body;

    const record = otpStore[identifier];

    if (!record) {
        return res.status(400).json({
            message: "Invalid or expired code"
        });
    }

    if (record.used) {
        return res.status(400).json({
            message: "Code already used"
        });
    }

    if (Date.now() > record.expiresAt) {
        return res.status(400).json({
            message: "Code expired"
        });
    }

    if (record.attempts >= 5) {
        return res.status(429).json({
            message: "Too many attempts"
        });
    }

    const valid = await bcrypt.compare(code, record.otpHash);

    if (!valid) {
        record.attempts++;

        return res.status(400).json({
            message: "Invalid or expired code",
            attempts_remaining: 5 - record.attempts
        });
    }

    record.used = true;

    const sessionToken = generateSessionToken();

    return res.status(200).json({
        message: "Verified",
        session_token: sessionToken
    });
};