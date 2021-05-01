const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb://localhost:27017')
    .then(client => {
      console.log('connected')
      _db = client.db('deneme')
      callback()
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

const getDb = () => {
  if (_db)
    return _db
  else
    throw 'No DB Found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb

