const mongoDb = require('mongodb')
const { getDb } = require('../util/database')

module.exports = class Product {
  constructor(title, imageUrl, description, price, userId, id) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
    this.userId = userId
    this._id = id ? new mongoDb.ObjectID(id) : null
  }

  save() {
    const db = getDb()
    let dbOperation

    if (this._id) {
      dbOperation = db.collection('products')
        .updateOne({ _id: this._id }, { $set: this })
    } else {
      console.log(this.userId)
      dbOperation = db.collection('products')
        .insertOne(this)
    }

    return dbOperation
      .then(result => {
        console.log(result)
      })
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        return products
      })
      .catch(err => console.log(err))
  }

  static findById(prodId) {
    const db = getDb()
    return db.collection('products')
      .find({ _id: new mongoDb.ObjectID(prodId) })
      .next()
      .then(product => product)
      .catch(err => console.log(err))
  }

  static deleteById(prodId) {
    const db = getDb()
    return db.collection('products')
      .deleteOne({ _id: new mongoDb.ObjectID(prodId) })
      .then(result => {
        console.log('deleted')
      })
      .catch(err => console.log(err))
  }
}