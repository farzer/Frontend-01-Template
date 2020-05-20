const Request = require('./client')
const serverStart = require('./server')

async function makeRequest() {
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
  return res;
}

describe('HTTP Parser', () => {
  test('should get null', () => {
    expect(null).toEqual(null)
  })
});



