// 1. 字符串转数字
/**
 * 
 * @param str 字符串
 * @param x 进制
 */
function convertStringToNumber(str: string, x: number) {
  if (arguments.length < 2) {
    x = 10
  }

  let chars = str.split('')
  let number = 0
  let i = 0
  while (i < chars.length && chars[i] !== '.') {
    number *= x
    number += chars[i].codePointAt(0) - '0'.codePointAt(0)
    i++
  }

  if (chars[i] === '.') {
    i++
  }

  let fraction = 1
  while (i < chars.length) {
    fraction /= x;
    number += (chars[i].codePointAt(0) - '0'.codePointAt(0))
    i++
  }

  return number
}

// 2. 数字转字符串
/**
 * 
 * @param num 数字
 * @param x 进制
 */
 function convertNumberToString(num: number, x: number) {
   let integer = Math.floor(num)
  let fraction = num - integer
  let str = ''
  while (integer > 0) {
    str += integer % x
    integer = Math.floor(integer / x)
  }

  // handle fraction
  return str
}