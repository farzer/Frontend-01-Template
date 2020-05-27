const http = require('http')
const net = require('net')
const detect = require('detect-port')

const listenPort = 8188;
const listenHost = '127.0.0.1'

void async function () {
  const newPort = await detect (listenPort)
  if (newPort !== listenPort) {
    return
  }
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('X-Foo', 'bar')
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    res.end(`<html maaa=a >
<head>
    <style>
#container {
    width: 500px;
    width: 100px;
    background-color: rgb(255, 255, 255);
}
#container #myid{
    width: 200px;
    height: 100px;
    background-color: rgb(255, 0, 0);
}
#container .c1 {
  flex: 1;
  background-color: rgb(0, 255, 0);
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
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
}()