// import module
const express = require('express') // sebagai sarana utama api
const bodyParser = require('body-parser') // untuk menghandle request ke dalam req.body
const cors = require('cors') // untuk izin sharing data
require('dotenv').config() // untuk setup file .env

// setup api
const app = express()

// setup database mysql
const db = require('./database')
db.connect((err) => {
    if (err) return console.error('error connecting: ' + err.stack)

    console.log('connected to mysql as id ' + db.threadId)
})

// apply middleware
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('<h1>This is Shoes API for React Native</h1>')
})

// setup router
const { userRouter, productRouter, orderRouter } = require('./routers')
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', orderRouter)

const PORT = 2000
app.listen(PORT, () => console.log(`Connected to PORT : ${PORT}`))