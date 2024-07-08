const { pool } = require('../db/connection');
const { createUser } = require('../db/createUser');
const { getTransactionsByUser } = require('../db/getTransactionsByUser');
const { verifyAccessToken } = require('../utils/jwt.utils');

const registerHandler = async (req, res) => {
    try {
        const user = req.body;
        await createUser(user);
        res.status(200).send({ message: 'user created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'user cannot be created' });
    }
};

const getTransactionsByUserHandler = async (req, res) => {
    try {
        const { accessToken } = req.cookies;
        const { userId, isSeller } = verifyAccessToken(accessToken);
        const transactions = await getTransactionsByUser(userId, isSeller);
        res.status(200).send(transactions);
    } catch (err) {
        console.log(err);
        res.statud(err.code || 500).send({ message: err.message || 'algo salió mal' });
    }
};

const processTransactionHandler = async (req, res) => {
    try {
        const { carrito } = req.body;
        const payment = processPayment(carrito);
        if (payment) {
            const query = 'INSERT INTO transacciones (buyerId, total, status, items) VALUES ($1, $2, $3, $4) RETURNING transactionId';
            const { rows } = await pool.query(query, [carrito.userId, carrito.total, 'pagado', JSON.stringify(carrito)]);
            console.log(rows);
            res.status(200).send({ message: 'Pago exitoso!', id: rows });
        }
    } catch (err) {
        console.log(err);
        res.status(err.code | 500).send({ message: err.message || 'algo salió mal' });
    }
};

module.exports = {
    registerHandler,
    getTransactionsByUserHandler,
    processTransactionHandler,
};
