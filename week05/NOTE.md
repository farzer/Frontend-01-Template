# 浏览器渲染过程

1. URL => HTTP
2. HTML => parse
3. DOM => css computing
4. DOM with CSS => layout
5. DOM with position => render
6. Bitmap

# HTTP 网络协议

### ISO-OSI 七层网络协议

- 应用层
- 表示层
- 会话层
- 传输层
- 网络层
- 数据链路层
- 物理层

真实开发中，HTTP 包含了应用、表示、会话层，具体到nodejs的是 http 包；TCP 包含 传输层，对应nodejs的 net 包；Internet 包括了 网络层；4G/5G/WIFI 包含 数据链路层和物理层；

### TCP 和 IP

### HTTP

#### Request

请求报文如下：

```cmd
POST / HTTP/1.1      # request line：包含 请求方法、请求路径、请求协议
HOST: 127.0.0.1      # headers: key:value 的形式
Content-Type: application/json
                     # 空行，重要！！！
test=1&&go=2         # body: 请求体
```

#### Response

响应报文如下：

```cmd
HTTP/1.1 200 OK                     # request line：包含 请求方法、请求路径、请求协议
Context-Type: text/html             # headers: key:value 的形式
Date: Mon, 23 Dec 2019 06:46:19 GMT
Connection: keep-alive
Transfer-Encoding: chunked
                                    # 空行，重要！！！
ok                                  # body: 请求体
0                                   # 0 结束
```