const http = require('http')

function bootstrap() {
  const listenPort = 8188;
  const listenHost = '127.0.0.1'

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('X-Foo', 'bar')
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('ok')
    })
    
    server.on('connection', () => {
      console.log('client 连接成功')
    })
    
    server.on('error', (err) => {
      console.log('server error: ', err)
    })
    
    server.listen(listenPort, listenHost, () => {
      console.log(`server is starting on http://${listenHost}:${listenPort}`)
      resolve(true)
    })
  })
}

module.exports = bootstrap