const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('shop.js', adminData.products);
  const products = adminData.products

  //res.sendFile(path.join(rootDir, 'views', 'shop.html'));

  res.render('shop', {
    products,
    title: 'Shop',
    path: '/',
    hasProducts: products.length > 0, //handlebars
    activeShop: true, //handlebars
    productCss: true //handlebats
  })

  //hasProduct & activeShop & productCss are only needed for handlebars because handlebars can evaluate js like pug
});

module.exports = router;
