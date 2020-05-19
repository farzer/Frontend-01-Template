// 1. 字符串转数字
/**
 * 
 * @param str 字符串
 * @param x 进制
 */
function convertStringToNumber(str, x) {
  if (arguments.length < 2) {
    x = 10
  }

  let chars = str.split('')
  let number = 0
  let i = 0
  // 整数部分
  while (i < chars.length && chars[i] !== '.') {
    number *= x
    number += chars[i].codePointAt(0) - '0'.codePointAt(0)
    i++
  }

  // 小数部分
  if (chars[i] === '.') {
    i++
  }
  let fraction = 1
  while (i < chars.length) {
    fraction /= x;
    number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) + fraction
    i++
  }


  return number + fraction;
}

// 2. 数字转字符串
/**
 * 
 * @param num 数字
 * @param x 进制
 */
function convertNumberToString(num, x) {
   let integer = Math.floor(num)
  let fraction = num - integer
  let str = integer ? '' + '0'
  // 整数部分
  while (integer > 0) {
    str = String(integer % x) + str
    integer = Math.floor(integer / x)
  }

  // handle fraction
  if (fraction > 0) {
    str += '.'
  }

  while (fraction > 0) {
    fraction *= x;
    str += Math.floor(fraction)
    fraction -= Math.floor(fraction)
  }

  return str
}