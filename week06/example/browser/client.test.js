const Request = require('./client');
const parser = require('./parser')
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

  let dom = null
  
  try {
    const res = await req.send()
    dom = parser.parseHTML(res.body)
  } catch (error) {
    console.log(error)
  }

  return dom
}

describe('Browser', () => {
  let result = null
  beforeAll((done) => {
    makeRequest().then(res => {
      result = res
      done()
    })
  })

  test('should be null', () => {
    expect(result).toBeNull()
  });
})