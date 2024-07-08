const { pool } = require("./connection");

const validateSession = async (sessionId) => {
    const query = 'SELECT isValid FROM sesiones WHERE sessionId = $1';
    const { rows: [isValid] } = await pool.query(query, [sessionId]);
    return {
        isValid: isValid,
    }
};

module.exports = { validateSession };
