const { pool } = require('./connection');
const bcrypt = require('bcryptjs');

const getUser = async (email, password) => {
    try {
        const query = 'SELECT nombreUsuario AS nombre, nombreTienda AS tienda, email, isActive AS active, isSeller AS seller, passwordHash AS hash FROM usuarios WHERE email = $1';
        const { rows: [user] } = await pool.query(query, [email]);

        if (!bcrypt.compareSync(password, user.hash)) {
            throw { code: 401, message: 'email o contraseña inválido' };
        }

        return {
            nombre: user.nombre,
            tienda: user.tienda,
            email: user.email,
            isActive: user.active,
            isSeller: user.seller,
        };
    } catch (err) {
        console.log(err);
        res.status(err.code || 500).send({ message: err.message || 'algo salió mal' });
    }
};

module.exports = { getUser };
