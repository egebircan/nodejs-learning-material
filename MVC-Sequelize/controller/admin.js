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

  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
    userId: req.user.id
  }).then(result => {
    console.log(result)
    res.redirect('/admin/products')
  }).catch(err => console.log(err))

  /* worse alternative
  Product.create({
    title,
    price,
    imageUrl,
    description,
    userId: req.user.id
  })
  */
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (editMode != 'true')
    return res.redirect('/')

  const prodId = req.params.productId

  req.user.getProducts({ where: { id: prodId } }) // fetches only the products belong to that particular user
    //Product.findByPk(prodId)
    .then(products => {

      const product = products[0] //for the getProducts method

      if (!product)
        return res.redirect('/')

      res.render('admin/edit-product', {
        title: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body

  Product.findByPk(productId)
    .then(product => {
      product.title = title
      product.price = price
      product.imageUrl = imageUrl
      product.description = description

      return product.save()
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

}

exports.getProducts = (req, res, next) => {
  //Product.findAll()
  req.user.getProducts()
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

  Product.findByPk(productId)
    .then(product => {
      return product.destroy()
    })
    .then(result => {
      console.log(result)
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

}