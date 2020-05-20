// 5. 使用mealy状态机匹配 abababx
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
  if (s === 'a') {
    return foundA3
  }

  // 也可能是第一个 b 这里
  return foundB(s)
}

function foundA3(s) {
  if (s === 'b') {
    return foundB3
  }

  return start(s)
}

function foundB3(s) {
  if (s === 'x') {
    return end
  }

  // 也可能是第2个 b 这里
  return foundB2(s)
}

function end(s) {
  return end
}

describe("使用 mealy 状态机 在一个字符串中找到 'abcabx'", () => {
  test('abababx shound be found', () => {
    expect(match('abababx')).toBe(true)
  })

  test('abcde shound not be found', () => {
    expect(match('abcde')).toBe(false)
  })

  test('abcabe shound not be found', () => {
    expect(match('abcabe')).toBe(false)
  })

  test('abcabcabc shound not be found', () => {
    expect(match('abcabcabc')).toBe(false)
  })

  test('abcabcabx shound not be found', () => {
    expect(match('abcabcabx')).toBe(false)
  })

  test('abababababx shound be found', () => {
    expect(match('abababababx')).toBe(true)
  })

  test('abababcababx shound not be found', () => {
    expect(match('abababcababx')).toBe(false)
  })

  test('ababababx shound be found', () => {
    expect(match('ababababx')).toBe(true)
  })

  test('abxabxabxababx shound not be found', () => {
    expect(match('abxabxabxababx')).toBe(false)
  })

  test('abxabxabxababx', () => {
    expect(match('abxabxabxababx')).toBe(false)
  })
})