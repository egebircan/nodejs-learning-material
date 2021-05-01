const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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

  console.log("butrsafasf")

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        title: 'Product Details',
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        title: 'Your cart',
        products
      })
    }).catch()
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body

  req.user
    .deleteItemFromCart(productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    title: 'Checkout'
  })
}

exports.postOrder = (req, res, next) => {
  req.user.addOrder()
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then(orders => {
      console.log(orders)
      res.render('shop/orders', {
        path: '/orders',
        title: 'Your orders',
        orders
      })
    })
    .catch(err => console.log(err))
}