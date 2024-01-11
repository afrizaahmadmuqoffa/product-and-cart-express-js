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

app.post('/add-cart', (req, res) => {
    const { product_id, quantity } = req.body
    const SQL = 'SELECT * FROM cart WHERE product_id = ?'
    db.query(SQL, product_id, (err, result) => {
        if (err) {
            console.error(err)
        } else {
            if (result.length > 0) {
                const quantitySQL = 'UPDATE cart SET quantity = quantity + ? WHERE product_id = ?'
                db.query(quantitySQL, [quantity, product_id], (err, result) => {
                    if (err) {
                        console.log('Gagal memperbarui keranjang!')
                    } else {
                        console.log('Berhasil memperbarui keranjang!')
                        res.status(200).json({ message: 'Success' })
                    }
                })
            } else {
                const addToCartQuery = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?)'
                db.query(addToCartQuery, [product_id, quantity], (err, result) => {
                    if (err) {
                        console.error('Gagal menambahkan produk ke keranjang:')
                    } else {
                        console.log('Produk berhasil ditambahkan ke keranjang')
                        res.status(200).json({ message: 'Success' })
                    }
                })
            }
        }
    })
})

app.get('/cart-shop', (req, res) => {
    const SQL = 'SELECT cart.*, menu.nama_menu, menu.harga FROM cart JOIN menu ON cart.product_id = menu.id'
    db.query(SQL, (err, result) => {
        if (err) {
            console.error(err)
        } else {
            res.render('cart', { cartList: result })
        }
    })
})

app.delete('/remove-cart/:productId', (req, res) => {
    const productId = req.params.productId
    const deleteSQL = 'DELETE FROM cart WHERE item_id = ?'

    db.query(deleteSQL, productId, (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Gagal menghapus item dari keranjang' })
        } else {
            return res.status(200).json({ message: 'Berhasil menghapus item dari keranjang' })
        }
    });
});

app.listen(port, () => {
    console.log(`Run in http://localhost:${port}`)
})