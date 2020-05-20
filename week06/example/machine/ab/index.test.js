// 2. 在一个字符串中找到 'ab'
function match(str) {
  let foundA = false
  for (const s of str) {
    if (s === 'a') {
      foundA = true
    } else if (foundA && s === 'b') {
      return true;
    } else {
      foundA = false
    }
  }

  return false;
}

describe("在一个字符串中找到 'ab'", () => {
  test("'asdfabsdfsdf' 找到 'ab'", () => {
    expect(match('asdfabsdfsdf')).toBe(true)
  });

  test("'asda bdfsdf' 找不到 'ab'", () => {
    expect(match('asda bdfsdf')).toBe(false)
  });

  test("'asdfsdfsdf' 找不到 'ab'", () => {
    expect(match('asdfsdfsdf')).toBe(false)
  });

  test("'你好' 找不到 'ab'", () => {
    expect(match('你好')).toBe(false)
  });
});
