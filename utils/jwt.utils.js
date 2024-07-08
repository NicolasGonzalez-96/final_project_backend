require('dotenv').config();
const { validateSession } = require('../db/validateSession');

const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const signAccessToken = (payload, expiresIn = '5m') => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
};

const signRefreshToken = (payload, expiresIn = '15d') => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
};

const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        return {
            payload: decoded,
            expired: false,
        };
    } catch (err) {
        return {
            payload: {},
            expired: true,
        };
    }
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        const isValid = validateSession(decoded.sessionId);
        return {
            payload: isValid ? decoded.payload : null,
            expired: isValid,
        };
    } catch (err) {
        return {
            payload: {},
            expired: true,
        };
    }
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
}
