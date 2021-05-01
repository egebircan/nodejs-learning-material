const Sequelize = require('sequelize')

const sequelize = require('../util/database')

//const User = require('./user')

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true
  }
})

/*
const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  userId: {
    type: Sequelize.INTEGER,
    unique: true,
    references: {
      model: User,
      key: 'id'
    }
  }
})
*/
module.exports = Cart