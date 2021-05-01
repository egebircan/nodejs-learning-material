const path = require('path');

const express = require('express');
//const expressHandlebars = require('express-handlebars')

const app = express();

//app.engine('handlebars', expressHandlebars({ layoutsDir: 'express101/views/layout', defaultLayout: 'main-layout' }))
//app.set('view engine', 'handlebars')

//app.set('view engine', 'pug')

app.set('view engine', 'ejs')
app.set('views', 'express101/views') // this is set to views by default 

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));

    res.status(404).render('404', { title: 'Page Not Found', path: '/404' })
});

app.listen(3000);
