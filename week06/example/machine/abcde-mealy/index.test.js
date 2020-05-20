// 4. 用 mealy 状态机匹配 abcde
function match(str) {
  let state = start
  for(let s of str) {
    state = state(s)
  }
  return state === end
}

function start(s) {
  if (s === 'a') {
    return foundA
  }

  return start
}

function end(s) {
  return end;
}

function foundA(s) {
  if (s === 'b') {
    return foundB
  }

  return start
}

function foundB(s) {
  if (s === 'c') {
    return foundC
  }

  return start
}

function foundC(s) {
  if (s === 'd') {
    return foundD
  }

  return start
}

function foundD(s) {
  if (s === 'e') {
    return end
  }

  return start
}

describe("使用 mealy 状态机 在一个字符串中找到 'abcde'", () => {
  test('abcde shound be found', () => {
    expect(match('abcde')).toBe(true)
  })

  test('abcade shound not be found', () => {
    expect(match('abcade')).toBe(false)
  })

  test('abcde shound be found', () => {
    expect(match('aabcabcde')).toBe(true)
  })

  test('abcade shound not be found', () => {
    expect(match('ababcade')).toBe(false)
  })
})