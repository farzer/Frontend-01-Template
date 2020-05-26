const parser = require('./parser')

const html = `<html maaa=a ><head><style>
</style></head>
<body><div class="sss" disabled='true' ><img id="myid"/><img /></div></body>
</html>`

describe('Step 3: parse Tag', () => {
  test('state should EOF Symbol', () => {
    expect(typeof parser.parseHTML(html)).toBe('symbol')
  });
});