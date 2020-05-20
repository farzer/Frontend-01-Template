require('./server')
const Request = require('./client');
const parser = require('./parser')
function makeRequest() {
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

  
  return req.send()
}

describe('Browser', () => {
  let result = null
  let dom = null
  beforeAll((done) => {
    makeRequest().then(res => {
      result = res
      // dom = parser.parseHTML(result.body)
      done()
    })
  })

  test('should be null', () => {
    expect(result).not.toBeNull()
  });
})