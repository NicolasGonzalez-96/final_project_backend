const { pool } = require('./connection');

const getProductos = async (limits = 10, order_by = 'id_ASC', page = 1) => {
    let [field, dir] = order_by.split('_');
    console.log(field, dir);

    switch (field) {
        case 'precio':
            field = 'precio_min';
            break;
        case 'stock':
            break;
        case 'nombre':
            field = 'p.nombre';
            break;
        default:
            field = 'p.productId';
    }

    switch (dir) {
        case 'DESC':
            break;
        default:
            dir = 'ASC';
    }

    if (limits > 50) limits = 50;
    if (limits < 1) limits = 1;

    const offset = (page - 1) * limits;

    const query = `
        SELECT 
            COUNT(*) OVER()::INTEGER AS total, 
            p.productId AS id, 
            p.nombre, 
            MIN(pub.precio) AS precio_min, 
            SUM(pub.stock)::INTEGER AS stock
        FROM 
            productos p
        JOIN 
            publicaciones pub ON p.productId = pub.productId
        WHERE p.isActive = TRUE
        GROUP BY 
            p.productId, 
            p.nombre
        ORDER BY ${field} ${dir}
        LIMIT ${limits}
        OFFSET ${offset}
    `;

    const { rows: productos } = await pool.query(query);
    const { total } = productos[0];
    const products = productos.map((entry) => {
        const { total, ...obj } = entry;
        return obj;
    });

    let next = null;
    let previous = null;

    if (Math.ceil(total / limits) < page) {
        next = `/productos?page=${page + 1}&limits=${limits}`;
    }

    if (page > 1) {
        previous = `/products?page=${page - 1}&limits=${limits}`;
    }

    return {
        pagina: page,
        productosPorPagina: limits,
        previous: previous,
        next, next,
        total: total,
        productos: products,
    };
};

module.exports = { getProductos };
