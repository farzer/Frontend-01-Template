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
// fromCharCode: 仅支持 bmp，超出会截取高位，如 0x0041 和 0x10041 都会输出 ‘A’
// fromCodePoint：为了解决 fromCharCode 的问题，es6 新增了 fromCodePoint，可以打印超出 0xFFFF 的码点
function utf8encode(str: string) {
  // usc-2 decode
  function ucs2decode(s: string) {
    const res = []
    let count = 0;
    const len = s.length;
    let value: number | undefined;
    let extra: number | undefined;
    // 在bmp中，从U+D800到U+DFFF是一个空段，即这些码点不对应任何字符。因此，这个空段可以用来映射辅助平面的字符。
    // 具体来说，辅助平面的字符位共有2^20个，也就是说，对应这些字符至少需要20个二进制位。
    // UTF-16将这20位拆成两半
    // 前10位映射在U+D800到U+DBFF（空间大小2^10），称为高位（H）
    // 后10位映射在U+DC00到U+DFFF（空间大小2^10），称为低位（L）。
    // 这意味着，一个辅助平面的字符，被拆成两个基本平面的字符表示。
    while (count < len) {
      value = s.charCodeAt(count)
      // 高位
      if (value >= 0xDB00 && value <= 0xDBFF && count < len) {
        extra = s.charCodeAt(count++)
        if (extra >= 0xDC00 && extra <= 0xDFFF) {
          
        }
      } else { // 4个字节
        res.push(value)
      }
    }
  }
  // 获取码点
  const codePoints = ucs2decode(str)
}

// 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
function stringLiteralTest(str: string) {
  const reg = /^(((\'[^\']+((\\'))*?[^\']+\')+)|((\"[^\"]+((\\"))*?[^\"]+\")+))$/
  return abstractNumberTest(reg)(str)
}