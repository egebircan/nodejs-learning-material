const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer');

const errorController = require('./controller/error')

const User = require('./model/user')

const MONGODB_URI = 'mongodb://localhost:27017/deneme'

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'MVC-FileUpload/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'MVC-FileUpload/views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }

  User.findById(req.session.user._id)
    .then(user => {
      //* req.session.user sıradan bir mongo dökümanı
      //* bu nedenle onun üzerinde mongoose methodlarını çağıramıyorduk
      //* bunu çözmek için database'den o id'ye ait user'ı (mongoose objesi) alıp kullanıyoruz
      //* session.user değerini ezmek yerine req.user'a atıyoruz
      req.user = user
      next()
    })
})

app.use(csrfProtection)

app.use(flash()) //* should be initialized after the session

app.use((req, res, next) => {
  //* res.render'lara teker teker vermek yerine bu şekilde hepsine değer geçilebilir
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()

  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000, () => console.log("Listening on port 3000"))
  })
  .catch(err => console.log(err))


