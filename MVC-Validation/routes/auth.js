const express = require('express');

const { check, body } = require('express-validator/check');

const authController = require('../controller/auth')

const router = express.Router();

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup)

router.post('/signup',
  [
    check('email').isEmail().withMessage('Email hatalı!').custom((value, { req }) => {
      return User.findOne({ email }).then(user => {
        if (user) {
          return Promise.reject('email already exists!')
        }
      })
    }),
    body('password', 'Please enter a valid password!!!!').isLength({ min: 5 }).isAlphanumeric(), // 2. argümanı default message
    body('confirmPassword', 'passwords dont match').custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error('Passwords have to match')
      }
    })
  ],
  authController.postSignup
)


router.get('/reset/:token', authController.getNewPassword)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.post('/new-password', authController.postNewPassword)


module.exports = router