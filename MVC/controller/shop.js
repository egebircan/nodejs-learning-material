const Product = require('../model/product')
const Cart = require('../model/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      title: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId

  Product.findById(prodId, product => {
    res.render('shop/product-detail', { product, title: 'Product Details', path: '/products' })
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      title: 'Shop',
      path: '/',
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })

  res.redirect('/cart')
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []

      for (product of products) {
        const cartProduct = cart.products.find(p => p.id == product.id)
        if (cartProduct) {
          cartProducts.push({ productData: product, quantity: cartProduct.quantity })
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        title: 'Your cart',
        products: cartProducts
      })
    })
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Cart.deleteProduct(productId)
  res.redirect('/cart')
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    title: 'Checkout'
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    title: 'Your orders'
  })
}