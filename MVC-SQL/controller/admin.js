const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body

  const product = new Product(null, title, imageUrl, description, price)

  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (editMode != 'true')
    return res.redirect('/')

  const prodId = req.params.productId

  Product.findById(prodId, product => {

    if (!product)
      return res.redirect('/')

    res.render('admin/edit-product', {
      title: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body

  const updatedProduct = new Product(productId, title, imageUrl, description, price)

  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products,
      title: 'Admin Products',
      path: '/admin/products',
    })
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.deleteById(productId)
  res.redirect('/admin/products')
}