// import module
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')
const { validationResult } = require('express-validator')
const cryptojs = require('crypto-js')
const db = require('../database')
const { createToken, verifyToken } = require('../helpers/jwt')

module.exports = {
    register: async (req, res) => {
        const { username, email, password } = req.body
        try {
            // validation input from user
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).send(errors.array())

            //hash password
            const hashpass = cryptojs.HmacMD5(password, process.env.CRYPTO_KEY).toString()

            // kalau tidak ada error, proses penambahan data user baru berjalan
            const checkUser = `SELECT * FROM users 
                              WHERE username=${db.escape(username)}
                              OR email=${db.escape(email)}`
            const resCheck = await asyncQuery(checkUser)

            if (resCheck.length !== 0) return res.status(400).send('Username or Email is already exist')

            const regQuery = `INSERT INTO users (username, password, email)
                              VALUES (${db.escape(username)}, ${db.escape(hashpass)}, ${db.escape(email)})`
            const resRegister = await asyncQuery(regQuery)
            // console.log(resRegister)

            const getUser = `SELECT * FROM users WHERE id_users = ${resRegister.insertId}`
            const resultGetUser = await asyncQuery(getUser)

            res.status(200).send(resultGetUser[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body
        try {
            const hashpass = cryptojs.HmacMD5(password, process.env.CRYPTO_KEY).toString()

            const loginQuery = `SELECT * FROM users WHERE username = ${db.escape(username)} AND password = ${db.escape(hashpass)}`
            const result = await asyncQuery(loginQuery)
            console.log(result[0])

            if (result.length === 0) return res.status(400).send('Username or Password is doesn\'t match')

            const token = createToken({ id_users: result[0].id_users, username: result[0].username})

            result[0].token = token

            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    keepLogin: async (req, res) => {
        // console.log(req.user)
        // console.log('keep login')

        try {
            // query to get data from database
            const getUser = `SELECT * FROM users WHERE id_users='${req.user.id_users}'`

            const result = await asyncQuery(getUser)
            // console.log('result dari query', result[0])

            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}