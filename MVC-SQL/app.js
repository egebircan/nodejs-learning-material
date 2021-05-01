const path = require('path');
const express = require('express');

const errorController = require('./controller/error')
const db = require('./util/database')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'MVC-SQL/views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//db.execute('SELECT * FROM PRODUCTS').then(data => console.log(data[0][0]))

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
