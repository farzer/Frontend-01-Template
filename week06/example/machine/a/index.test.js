// 1. 在一个字符串中找到 'a'
function match(str) {
  for (const s of str) {
    if (s === 'a') {
      return true
    }
  }

  return false;
}

describe("在一个字符串中找到 'a'", () => {
  test("'asdfsdfsdf' 找到 'a'", () => {
    expect(match('asdfsdfsdf')).toBe(true)
  });

  test("'asdfsdfsdf' 找不到 'a'", () => {
    expect(match('zsdsdfsdf')).toBe(false)
  });

  test("'你好' 找不到 'a'", () => {
    expect(match('你好')).toBe(false)
  });
});

