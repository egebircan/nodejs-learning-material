const mongoose = require('mongoose');

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
})

userSchema.methods.addToCart = function (product) {
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

  this.cart = updatedCart

  return this.save()
}

userSchema.methods.deleteFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(i => {
    return i.productId.toString() != productId
  })

  this.cart.items = updatedCartItems
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }

  return this.save()
}

module.exports = mongoose.model('User', userSchema)
