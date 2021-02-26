const { asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    product: async (req, res) => {
        try {
            const getProduct = `select p.*, group_concat(pi.images separator ',') images from product p 
            left join product_img pi
            on p.id = pi.produk_id
            group by p.id
            order by p.id`
            const result = await asyncQuery(getProduct)

            result.map(item => {
                item.images = item.images.split(',')
            })

            // let images = result[0].images.split(',')

            // console.log(images)

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send
        }
    },
    carousel: async (req, res) => {
        try {
            const getCarousel = `select * from carousel`
            const result = await asyncQuery(getCarousel)

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send
        }
    }
}