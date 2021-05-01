const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {
    products,
    title: 'Add Product',
    path: '/admin/add-product',
    formsCss: true, //handlebars
    productCss: true, //handlebars
    activeAddProduct: true //handlebars
  })

});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });

  res.redirect('/');
});

exports.routes = router;
exports.products = products;
