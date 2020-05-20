// 5. 使用mealy状态机匹配 abcabx
function match(str) {
  let state = start
  for (const s of str) {
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

function foundA(s) {
  if (s === 'b') {
    return foundB
  }

  return start(s)
}

function foundB(s) {
  if (s === 'c') {
    return foundC
  }

  return start(s)
}

function foundC(s) {
  if (s === 'a') {
    return foundA2
  }

  return start(s)
}

function foundA2(s) {
  if (s === 'b') {
    return foundB2
  }

  return start(s)
}

function foundB2(s) {
  if (s === 'x') {
    return end
  }

  // 也可能是第一个 b 这里

  return foundB(s)
}

function end(s) {
  return end
}

describe("使用 mealy 状态机 在一个字符串中找到 'abcabx'", () => {
  test('abcde shound not be found', () => {
    expect(match('abcde')).toBe(false)
  })

  test('abcabe shound not be found', () => {
    expect(match('abcabe')).toBe(false)
  })

  test('abcabcabc shound not be found', () => {
    expect(match('abcabcabc')).toBe(false)
  })

  test('abcabcabx', () => {
    expect(match('abcabcabx')).toBe(true)
  })
})