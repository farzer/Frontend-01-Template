const abstractNumberTest = (reg: RegExp) => (num: string | number) => reg.test(`${num}`)

// 1. 写一个正则表达式 匹配所有 Number 直接量
function numberTest(testNum: string| number, bit?: 2 | 8 | 10 | 16) {
  const decimalReg = /^([-+]?\.?(0|([1-9][0-9]*)))((\.?\d*)|((\.\d+)?[eE][+-]?\d*)?)$/;
  const binaryReg = /^0[bB][01]+$/
  const octalReg = /^0[Oo][0-7]+$/
  const hexReg = /^0[xX][0-9A-F]$/
  const numberReg = /^((([-+]?\.?(0|([1-9][0-9]*)))((\.?\d*)|((\.\d+)?[eE][+-]?\d*)?))|(0(([bB][0-9])|([oO][0-7])|([xX][0-9A-Fa-f]))))$/
  const decimalNumberTest = abstractNumberTest(decimalReg)
  const binaryNumberTest = abstractNumberTest(binaryReg)
  const octalNumberTest = abstractNumberTest(octalReg)
  const hexNumberTest = abstractNumberTest(hexReg)
  const finalTest = abstractNumberTest(numberReg)

  switch (bit) {
    case 2:
      return binaryNumberTest(testNum)
    case 8:
      return octalNumberTest(testNum)
    case 10:
      return decimalNumberTest(testNum)
    case 16:
      return hexNumberTest(testNum)
    default:
      return finalTest(testNum)
  }
}

// 2. 写一个 UTF-8 Encoding 的函数
function utf8encode(str) {
  // usc-2 decode
  function getCodePoints(s) {
    const res = []
    let count = 0;
    while (count < s.length) {
      res.push(s.codePointAt(count++))
    }
    return res;
  }
  // 获取 unicode 码点
  const codePoints = getCodePoints(str)
  const tmp = [];
  codePoints.forEach(point => {
    const utf8Str = []
    // ASCII 码直接转 16
    if (point <= 0x7F) {
      utf8Str.push(point.toString(16))
    } else { // 大于 127
      // 大端表示法表示码点
      let obStr = point.toString(2)
      let n = 0;

      while (obStr.length > 6) {
        // 获取最后6个
        const current0b = obStr.slice(obStr.length - 6)
        const pad10 = `10${current0b}`
        utf8Str.unshift(pad10);
        // 去掉最后六个长度
        obStr = obStr.slice(0, obStr.length - 6)
        n++;
      }

      // 补最高位
      const padBits = (new Array(8)).fill(0)
      for (let index = 0; index < n + 1; index++) {
        padBits[index] = 1
      }
      for (let index = 0; index < obStr.length; index++) {
        padBits[padBits.length - 1 - index] = obStr[obStr.length - 1 - index];
      }

      utf8Str.unshift(padBits.join(''))
    }
    const oxStrArr = utf8Str.map(us => {
      const obNum = parseInt(us, 2)
      const oxNum = obNum.toString(16)
      return `\\x${oxNum}`
    })
    tmp.push(oxStrArr)
  })
  return tmp.reduce((prev, currv) => prev + currv.join(''), '')
}

// 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
function stringLiteralTest(str: string) {
  const reg = /^(((\'[^\']+((\\'))*?[^\']+\')+)|((\"[^\"]+((\\"))*?[^\"]+\")+))$/
  return abstractNumberTest(reg)(str)
}