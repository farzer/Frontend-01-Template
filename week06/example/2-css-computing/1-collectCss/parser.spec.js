const parser = require('./parser')

const html = `<html maaa=a ><head><style>
body div #myid{width:100px;}</style></head>
<body><div class="sss" disabled='true' ><img id="myid"/><img /></div></body>
</html>`

describe('Css Computing 1:', () => {
  let rules = [], state = null
  beforeAll(() => {
    const { state: resState, rules: resRules } = parser.parseHTML(html);
    state = resState
    rules = resRules
  })

  test('should get rules', () => {
    expect(rules.length).toBeGreaterThan(0)
  });
});