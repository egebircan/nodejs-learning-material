const Product = require('../model/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body
  const image = req.file || null

  if (!image) {
    return res.redirect('/admin/add-product')
  }

  const imageUrl = image.path

  const product = new Product({ title, imageUrl, description, price, userId: req.user })

  product.save()
    .then(result => {
      console.log('created product')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (editMode != 'true')
    return res.redirect('/')

  const prodId = req.params.productId

  Product.findById(prodId)
    .then(product => {
      if (!product)
        return res.redirect('/')

      res.render('admin/edit-product', {
        title: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product,
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body

  Product.findById(productId)
    .then(product => {
      if (product.userId != req.user._id) {
        return res.redirect('/')
      }

      product.title = title
      product.price = price
      product.imageUrl = imageUrl
      product.description = description

      return product.save()
        .then(result => {
          res.redirect('/admin/products')
        })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        products,
        title: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

}