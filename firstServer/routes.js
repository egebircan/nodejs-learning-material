const fs = require('fs')

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method

  if (url == '/') {
    //res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<body>')
    res.write('<form action="/message" method="POST"><input required type="text" name="message"><button type="submit">Send</button></form>')
    res.write('</body>')
    res.write('</html>')
    return res.end()
  }

  if (url === '/message' && method === 'POST') {

    const body = []
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk)
    })

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      console.log(parsedBody)

      const message = parsedBody.split('=')[1]
      fs.writeFile('message.txt', message, err => {
        res.statusCode = 302
        res.setHeader('Location', '/')
        return res.end()
      })
    })
  }
}

module.exports = {
  handler: requestHandler,
  someText: "Some hard coded text"
}

//  Alternative 1 when you wanna export 1 thing
//module.exports = requestHandler 

//  Alternative 2
//module.exports.handler = requestHandler
//module.exports.someText = "Some hard coded text"

//  Alternative 3
//exports.handler = requestHandler
//exports.someText = "Some hard coded text"