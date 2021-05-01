const path = require('path');
const express = require('express');

const errorController = require('./controller/error')

const sequelize = require('./util/database')
const Product = require('./model/product')
const User = require('./model/user')
const Cart = require('./model/cart')
const CartItem = require('./model/cart-item')
const Order = require('./model/order')
const OrderItem = require('./model/order-item')


const app = express();

app.set('view engine', 'ejs')
app.set('views', 'MVC-Sequelize/views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//db.execute('SELECT * FROM PRODUCTS').then(data => console.log(data[0][0]))

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      // the returned user value is a sequelize object not a plain js object
      req.user = user
      next()
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


//! DATABASE OPERATIONS

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
})
User.hasMany(Product) // OPTIONAL

User.hasOne(Cart)
Cart.belongsTo(User)
//Cart.belongsTo(User, { foreignKey: 'userId' })

Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

Order.belongsTo(User)
User.hasMany(Order)

Order.belongsToMany(Product, { through: OrderItem })


sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1)
    //console.log(result)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Ege', email: 'test@test.com' })
    }

    //return Promise.resolve(user) //optional because when you return in then it is automatically wrapped into a promise
    return user
  })
  .then(user => {
    //console.log(user)
    return user.createCart()
  })
  .then(cart => {
    app.listen(3000, () => console.log('listening on port 3000'));

  })
  .catch(err => console.log('ERROR: ' + err))

