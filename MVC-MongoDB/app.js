const path = require('path');
const express = require('express');

const errorController = require('./controller/error')

const { mongoConnect } = require('./util/database')

const User = require('./model/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'MVC-MongoDB/views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  User.findById('6076e8f7bb3128a80e4367d2')
    .then(user => {
      req.user = new User(user.username, user.email, user.cart, user._id)
      next()
    })
    .catch(err => console.log(err))
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000, () => console.log('listening on port 3000'));
})


