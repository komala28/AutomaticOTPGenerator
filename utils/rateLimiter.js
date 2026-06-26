function canSendOTP(identifier, sendRateLimit) {
    const now = Date.now();

    if (!sendRateLimit[identifier]) {
        sendRateLimit[identifier] = [];
    }

    sendRateLimit[identifier] =
        sendRateLimit[identifier].filter(
            time => now - time < 10 * 60 * 1000
        );

    if (sendRateLimit[identifier].length >= 3) {
        return false;
    }

    sendRateLimit[identifier].push(now);

    return true;
}

module.exports = canSendOTP;