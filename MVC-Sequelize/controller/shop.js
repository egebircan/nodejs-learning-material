const Product = require('../model/product')

exports.getProducts = (req, res, next) => {
  Product.findAll()
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

  /*
  Product.findAll({
    where: {
      id: prodId
    }
  }).then(productsArray => console.log(productsArray)).catch()
  */

  Product.findByPk(prodId)
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
  Product.findAll()
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

  let fetchedCart
  let newQuantity

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product

      if (products.length > 0)
        product = products[0]

      newQuantity = 1
      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
        return product
      }

      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart => {
    return cart.getProducts()
      .then(products => {
        res.render('shop/cart', {
          path: '/cart',
          title: 'Your cart',
          products
        })
      }).catch()
  }).catch()
}

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      const product = products[0]
      return product.cartItem.destroy()
    })
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
  let fetchedCart
  let orderProducts

  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      orderProducts = products
      return req.user.createOrder()
    })
    .then(order => {
      return order.addProducts(orderProducts.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity } //bu nasıl oluyor
        return product
      }))
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })
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