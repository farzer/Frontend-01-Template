const http = require('http')

const listenPort = 8188;
const listenHost = '127.0.0.1'

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Foo', 'bar')
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.end(`<html maaa=a >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div class="sss" disabled='true' >
        <img id="myid"/>
        <img />
    </div>
</body>
</html>`)
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