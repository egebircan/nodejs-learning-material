const { expect } = require('chai')
const sinon = require('sinon')

const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/is-auth')

describe('Auth middleware', () => {
  it('should throw an error if no auth header is present', () => {
    const req = {
      get: function () {
        return null
      }
    }

    expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.')
  })

  it('should return the decoded jwt if everything goes fine', () => {
    const req = {
      get: function () {
        return 'Bearer asfdsfgfdgd'
      }
    }

    sinon.stub(jwt, 'verify')
    jwt.verify.returns({ userId: 'asfsdfege' })

    /*
    jwt.verify = function () {
      return { decodedMail: 'asfsdfege' }
    }
    */

    authMiddleware(req, {}, () => { })
    expect(req).to.have.property('userId')
    expect(req).to.have.property('userId', 'asfsdfege')
    expect(jwt.verify.called).to.be.true

    jwt.verify.restore()
  })


  it('should throw an error if auth header is only one chunk of string', () => {
    const req = {
      get: function () {
        return 'asfsdfdsgffdhfg'
      }
    }

    expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
  })
})
