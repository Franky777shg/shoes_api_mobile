const { asyncQuery, generateQuery } = require('../helpers/queryHelp')
const db = require('../database')

module.exports = {
    addCart: async (req, res) => {
        let { order_number, id_user, id_product, color, size, qty, total } = req.body


        try {
            // check order user
            const checkOrder = `SELECT * FROM orders WHERE id_user = ${db.escape(id_user)} AND status = 1`
            const check = await asyncQuery(checkOrder)

            order_number = check.length !== 0 ? check[0].order_number : order_number

            if (check.length === 0) {

                // insert into table orders
                const addOrders = `INSERT INTO orders (order_number, id_user, status) VALUES
                (${db.escape(order_number)}, ${db.escape(id_user)}, 1)`
                const result = await asyncQuery(addOrders)
            }

            // insert into table order_details
            const addDetail = `INSERT INTO order_details (order_number, qty, size, color, id_product, total) VALUES 
                                (${db.escape(order_number)}, ${db.escape(qty)}, ${db.escape(size)}, ${db.escape(color)},
                                ${db.escape(id_product)}, ${db.escape(total)})`
            const result2 = await asyncQuery(addDetail)

            res.status(200).send('Add to cart success')
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    getCart: async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            const getCart = `select o.order_number, o.id_user, os.status , od.id_product, od.qty, od.size, od.color, od.total, p.nama, p.harga, p.brand, p.rating, pi.images
            from orders o
            join order_details od on o.order_number = od.order_number
            join product p on od.id_product = p.id
            join order_status os on o.status = os.id_status
            join product_img pi on od.id_product = pi.produk_id
            where o.status = 1 and o.id_user = ${id}
            group by od.id_product`

            const result = await asyncQuery(getCart)

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    editCart: async (req, res) => {
        const id = +req.params.id
        const { qty, total, order_number } = req.body

        try {
            const editQty = `UPDATE order_details SET qty = ${db.escape(qty)}, total = ${db.escape(total)}
                            WHERE id_product = ${db.escape(id)} AND order_number = ${db.escape(order_number)}`
            await asyncQuery(editQty)

            res.status(200).send(`edit cart for id_product ${id} success`)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    deleteCart: async (req, res) => {
        const { id_product, order_number } = req.body

        try {
            const deleteItem = `DELETE FROM order_details WHERE 
                                id_product = ${db.escape(id_product)} AND order_number = ${db.escape(order_number)}`
            await asyncQuery(deleteItem)

            res.status(200).send(`delete cart for id_product ${id_product} success`)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}