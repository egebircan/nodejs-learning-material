const { expect } = require('chai')
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller - Login', () => {

  it('should throw an error with code 500 if accessing the db fails', async () => {
    sinon.stub(User, 'findOne')
    User.findOne.throws()

    const req = {
      body: {
        email: "mail",
        password: 'password'
      }
    }

    const result = await AuthController.login(req, {}, () => { })
    console.log(typeof result)
    //expect(result).to.be.an('error') //* kütüphanede problem var
    expect(result).to.have.property('statusCode', 500)

    //expect(AuthController.login())

    User.findOne.restore()
  })
})