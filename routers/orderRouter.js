const router = require('express').Router()

const { orderController } = require('../controllers')

router.post('/add', orderController.addCart)
router.get('/get/:id', orderController.getCart)
router.post('/edit/:id', orderController.editCart)
router.delete('/delete', orderController.deleteCart)

module.exports = router