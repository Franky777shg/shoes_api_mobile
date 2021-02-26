const { asyncQuery, generateQuery } = require('../helpers/queryHelp')
const db = require('../database')

module.exports = {
    addCart: async (req, res) => {
        const { order_number, id_user, id_product, color, size, qty, total } = req.body

        
        try {
            // check order user
            const checkOrder = `SELECT * FROM orders WHERE id_user = ${db.escape(id_user)} AND status = 1`
            const check = await asyncQuery(checkOrder)
            
            if(check.length === 0) {
                let new_order_number = check.length !== 0 ? check[0].order_number : order_number

                // insert into table orders
                const addOrders = `INSERT INTO orders (order_number, id_user, status) VALUES
                (${db.escape(new_order_number)}, ${db.escape(id_user)}, 1)`
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
    }
}