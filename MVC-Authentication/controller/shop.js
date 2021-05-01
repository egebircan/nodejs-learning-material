const Product = require('../model/product')
const Order = require('../model/order')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        products,
        title: 'All Products',
        path: '/products',
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        title: 'Product Details',
        path: '/products',
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        products,
        title: 'Index',
        path: '/',
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      console.log(result)
      res.redirect('/products')
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      let products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        title: 'Your cart',
        products,
      })
    }).catch()
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body

  req.user
    .deleteFromCart(productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    title: 'Checkout',
  })
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      let products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: i.productId._doc }
      })

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user //mongoose automatically will pick the id
        },
        products
      })

      return order.save()

    })
    .then(result => {
      req.user.clearCart()
      res.redirect('/orders')
    })
    .catch()
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      console.log(orders)
      res.render('shop/orders', {
        path: '/orders',
        title: 'Your orders',
        orders,
      })
    })
    .catch(err => console.log(err))
}