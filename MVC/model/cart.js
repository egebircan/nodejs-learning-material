const fs = require('fs');
const path = require('path');

const mainPath = require('../util/path')

const p = path.join(mainPath, 'data', 'cart.json')

module.exports = class Cart {

  static addProduct(id, price) {
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 }

      if (!err) {
        cart = JSON.parse(data)
      }

      const existingProductIndex = cart.products.findIndex(p => p.id == id)
      const existingProduct = cart.products[existingProductIndex]

      let updatedProduct

      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.quantity = updatedProduct.quantity + 1
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, price, quantity: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +price //unary plus

      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id) {
    fs.readFile(p, (err, data) => {
      if (err) {
        return console.log(err)
      }

      const updatedCart = JSON.parse(data)
      const product = updatedCart.products.find(p => p.id == id)

      if (!product)
        return

      const { quantity, price } = product
      updatedCart.products = updatedCart.products.filter(p => p.id != id)
      updatedCart.totalPrice -= quantity * price

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err)
      })
    })
  }

  static getCart(callback) {
    fs.readFile(p, (err, data) => {
      if (err)
        return callback({ products: [], totalPrice: 0 })

      const cart = JSON.parse(data)
      callback(cart)
    })
  }
}