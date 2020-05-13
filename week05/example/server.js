const http = require('http')

const listenPort = 8188;
const listenHost = '127.0.0.1'

const server = http.createServer((req, res) => {
  console.log('收到请求：')
  console.log(req.headers)
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
})