const parser = require('./parser')

const html = `<html maaa=a ><head><style>
body div #myid{width:100px;}</style></head>
<body><div class="sss" disabled='true' ><img id="myid"/><img /></div></body>
</html>`

describe('Step 3: parse Tag', () => {
  let state = null, tokenArr = []
  beforeAll(() => {
    const { state: resState, tokenArr: resTokenArr } = parser.parseHTML(html);
    state = resState
    tokenArr = resTokenArr
  })
  test('state should EOF Symbol', () => {
    expect(typeof state).toBe('symbol')
  });

  test('tokenArr should contain two img tagName', () => {
    const imgs = tokenArr.filter(token => token.tagName === 'img')
    expect(imgs.length).toBe(2)
  });

  test('the first img token should contain an id attribute', () => {
    const imgs = tokenArr.filter(token => token.tagName === 'img')
    expect(imgs[0].id).toBeDefined()
  });
});