const parser = require('./parser')

const html = `<html maaa=a >
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
</html>`

describe('Step one', () => {
  describe('Parser', () => {
    test('should be defined', () => {
      expect(parser).toBeDefined()
    });
  });
});