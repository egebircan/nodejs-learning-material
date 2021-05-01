const fs = require('fs')
const path = require('path');

const mainPath = require('../util/path')
const Cart = require('./cart')

const p = path.join(mainPath, 'data', 'products.json')

const getProductsFromFile = callback => {
  fs.readFile(p, (err, data) => {
    if (err)
      callback([])
    else
      callback(JSON.parse(data))
  })
}


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id == this.id)
        products[existingProductIndex] = this

        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err)
        })
      } else {
        this.id = Math.random().toString()

        products.push(this)
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err)
        })
      }
    })
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(p => p.id != id)

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id)
        }
      })
    })

  }

  static fetchAll(callback) {
    getProductsFromFile(callback)
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id == id)
      callback(product)
    })
  }
}