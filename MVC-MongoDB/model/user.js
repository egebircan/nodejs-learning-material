const mongoDb = require('mongodb')
const { getDb } = require('../util/database')

class User {
  constructor(username, email, cart, id) {
    this.username = username
    this.email = email
    this.cart = cart
    this._id = id
  }

  save() {
    const db = getDb()
    return db.collection('users').insertOne(this)
  }

  addToCart(product) {
    let updatedCart
    let updatedCartItems = this.cart ? [...this.cart.items] : []
    let newQuantity = 1

    const cartItemIndex = this.cart ? this.cart.items.findIndex(p => p.productId.toString() == product._id.toString()) : -1
    if (cartItemIndex != -1) {
      newQuantity = this.cart.items[cartItemIndex].quantity + 1
      updatedCartItems[cartItemIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      })
    }

    updatedCart = { items: updatedCartItems }

    const db = getDb()

    return db.collection('users').updateOne(
      { _id: this._id },
      { $set: { cart: updatedCart } }
    )
  }

  getCart() {
    const db = getDb()

    if (this.cart) {
      const productIds = this.cart.items.map(p => p.productId)
      return db.collection('products')
        .find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
          return products.map(p => {
            return {
              ...p, quantity: this.cart.items.find(i => {
                return i.productId.toString() == p._id.toString()
              }).quantity
            }
          })
        })
    } else {
      return Promise.resolve([])
    }
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(i => {
      return i.productId.toString() != productId
    })

    const db = getDb()

    return db.collection('users').updateOne(
      { _id: this._id },
      { $set: { cart: { items: updatedCartItems } } }
    )
  }

  addOrder() {
    const db = getDb()
    return db.collection('orders')
      .insertOne({ userId: this._id, cart: this.cart })
      .then(result => {
        this.cart = { items: [] }
        return db.collection('users')
          .updateOne(
            { _id: this._id },
            { $set: { cart: { items: [] } } }
          )
      })
  }

  getOrders() {
    const db = getDb()
    return db.collection('orders')
      .find({ userId: this._id })
      .toArray()

  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new mongoDb.ObjectID(userId) })
      .then(user => user)
      .catch(err => console.log(err))
  }
}

module.exports = User