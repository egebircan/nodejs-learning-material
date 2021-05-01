const crypto = require('crypto');

const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport')

const User = require('../model/user');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: ""
  }
}))

exports.getLogin = (req, res, next) => {
  //const isLoggedIn = req.get('Cookie').split('=')[1]
  let message = req.flash('error')

  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/login', {
    path: '/login',
    title: 'Login',
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie', 'loggedIn=true')

  const { email, password } = req.body

  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log('invalid user')
        req.flash('error', 'Invalid email or password')
        return res.redirect('/login')
      }

      bcrypt.compare(password, user.password)
        .then(match => {
          if (match) {
            req.session.user = user
            req.session.isLoggedIn = true

            return req.session.save((err) => {
              res.redirect('/')
            })
          }

          return res.redirect('/login')
        })
        .catch(err => res.redirect('/login'))
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    title: 'Sign Up',
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422)
      .render('auth/signup', {
        path: '/signup',
        title: 'Sign Up',
      })
  }

  bcrypt.hash(password, 12)
    .then(hash => {
      const newUser = new User({
        email,
        password: hash,
        cart: { items: [] }
      })

      return newUser.save()
    })
    .then(result => {
      res.redirect('/login')

      //! E-mail sending
      /*  
      return transporter.sendMail({
        to: email,
        from: 'deneme@deneme.com',
        subject: 'SignUp Succesful!',
        html: '<h1> You succesfully signed up! </h1>'
      })
      */
    })
    .catch(err => console.log(err))
}

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    title: 'Reset Password',
    errorMessage: null
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }

    const token = buffer.toString('hex')

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found')
          return res.redirect('/reset')
        }

        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000

        return user.save()
      })
      .then(result => {
        res.redirect('/login')
        transporter.sendMail({
          to: email,
          from: 'deneme@deneme.com',
          subject: 'Password Reset',
          html: `
          <p>You requested a new password</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}"> link to set a new password </a> </p>
          `
        })
      })
      .catch(err => console.log(err))
  })
}


exports.getNewPassword = (req, res, next) => {
  const { token } = req.params

  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  })
    .then(user => {
      res.render('auth/new-password', {
        path: '/new-password',
        title: 'New Password',
        errorMessage: null,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body

  let resetUser
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {
      $gt: Date.now()
    },
    _id: userId
  })
    .then(user => {
      resetUser = user
      return bcrypt.hash(password, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword

      //* null yerine undefined dediğimiz için o alanlar silinecek
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined

      return resetUser.save()
    })
    .then(result => {
      res.redirect('/login')
    })
    .catch(err => console.log(err))
}