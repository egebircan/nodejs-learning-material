const path = require('path');
const express = require('express');
const mongoose = require('mongoose')


const errorController = require('./controller/error')

const User = require('./model/user')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'MVC-Mongoose/views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  User.findById('60777eefb8328caf5ce82414')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb://localhost:27017/deneme')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Ege',
          email: 'egebrcn@hotmail.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000, () => console.log("Listening on port 3000"))
  })
  .catch(err => console.log(err))


