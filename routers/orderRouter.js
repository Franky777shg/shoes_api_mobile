const router = require('express').Router()

const { orderController } = require('../controllers')

router.post('/add', orderController.addCart)

module.exports = router