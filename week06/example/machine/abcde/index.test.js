// 3. 在一个字符串中找到 'abcde'
function match(str) {
  let foundA = false
  let foundB = false
  let foundC = false
  let foundD = false

  for (const s of str) {
    if (s === 'a') {
      foundA = true
      foundB = false
      foundC = false
      foundD = false
    } else if (foundA && s === 'b') {
      foundB = true
      foundC = false
      foundD = false
    } else if (foundB && s === 'c') {
      foundC = true
      foundD = false
    } else if (foundC && s === 'd') {
      foundD = true
    } else if (foundD && s === 'e') {
      return true
    } else {
      foundA = false
      foundB = false
      foundC = false
      foundD = false
    }
  }

  return false
}

describe("在一个字符串中找到 'abcde'", () => {
  test('abcde shound be found', () => {
    expect(match('abcde')).toBe(true)
  })

  test('abcade shound not be found', () => {
    expect(match('abcade')).toBe(false)
  })
})