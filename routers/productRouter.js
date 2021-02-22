const router = require('express').Router()

const { productController } = require('../controllers')

router.get('/getProduct', productController.product)
router.get('/getCarousel', productController.carousel)

module.exports = router