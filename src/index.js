const express = require('express')
const dotenv = require('dotenv')
const ejs = require('ejs')
const path = require('path')
const app = express()
const db = require('../config/db.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

dotenv.config()
const port = process.env.PORT

const cart = []

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/products', (req, res) => {
    const SQL = 'SELECT menu.*, kategori_menu.kategori FROM menu INNER JOIN kategori_menu ON menu.kategori_id = kategori_menu.id'
    db.query(SQL, (err, result) => {
        if (err) {
            console.error(err)
        } else {
            res.render('products', { dataMenu: result })
        }
    })
})

app.get('/cart-shop', (req, res) => {
    res.render('cart')
})

app.listen(port, () => {
    console.log(`Run in http://localhost:${port}`)
})