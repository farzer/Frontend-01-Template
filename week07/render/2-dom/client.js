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
  let viewport = images(800, 600)
  render(viewport, stack[0])
  viewport.save(path.join(__dirname, 'viewport.jpg'))
}()