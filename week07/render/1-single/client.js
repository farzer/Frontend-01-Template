const Request = require('../../../week05/example/client.js')
const parser = require('./parser.js')
const render = require('./render')
const images = require('images')
const path = require('path')

void async function() {
  const req = new Request({
    method: 'POST',
    host: '127.0.0.1',
    path: '/',
    port: 8188,
    headers: {
      'X-Type': 'big'
    },
    body: {
      field: 1,
      test: 2
    }
  })


  const res = await req.send()

  const { stack } = parser.parseHTML(res.body)
  const dom = stack[0]
  let redViewport = images(800, 600)
  let greenViewport = images(800, 600)
  const container = dom.children[0].children[3].children[1]
  const green = container.children[3]
  const red = container.children[1]
  render(redViewport, red)
  redViewport.save(path.join(__dirname, 'red-viewport.jpg'))
  render(greenViewport, green)
  greenViewport.save(path.join(__dirname, 'green-viewport.jpg'))
}()