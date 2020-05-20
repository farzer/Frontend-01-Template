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
  let result = null
  beforeAll((done) => {
    makeRequest().then(res => {
      result = res
      done()
    })
  })
  test('should not be null', () => {
    expect(result).not.toEqual(null)
  })

  test('should not be undefined', () => {
    expect(result).not.toEqual(undefined)
  })

  test('should be a object', () => {
    expect(typeof result).toEqual('object')
  })

  test('should be 200', () => {
    expect(result.statusCode).toEqual('200')
  })

  test('should be ok', () => {
    expect(result.statusText).toEqual('OK')
  })
});



