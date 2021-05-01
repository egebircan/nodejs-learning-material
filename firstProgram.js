const fs = require('fs')

//s.writeFileSync('hello.txt', 'Hello from Node.js')

const person = {
  name: "max",
  age: 23,
  greet: function () {
    console.log(this.name)
  }
}

person.greet()

const toArray = (...args) => {
  return args
}

console.log(toArray(1, 2, 3, 4))