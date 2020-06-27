function parse(source) {
  const stack = []
  for (const c of source) {
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c)
    }
    if (c === ')') {
      if (stack[stack.length - 1] === '(') {
        stack.pop()
      } else {
        return false
      }
    }

    if (c === ']') {
      if (stack[stack.length - 1] === '[') {
        stack.pop()
      } else {
        return false
      }
    }

    if (c === '}') {
      if (stack[stack.length - 1] === '{') {
        stack.pop()
      } else {
        return false
      }
    }
  }

  if (stack.length === 0) {
    return true
  }

  return false
}

module.exports = parse