function find(source, pattern) {
  // 查找星号数量
  for (let index = 0; index < pattern.length; index++) {
    let startCount = 0
    if (pattern[index] === '*') {
      startCount++
    }
    
    // pattern 不包含星号
    if (startCount === 0) {
      for (let index = 0; index < source.length; index++) {
        if (source[index] !== pattern[index] && pattern[index] !== '*') {
          return false
        }
        
        return true
      }
    }

    // 查找第一个星之前
    let i = 0
    for (; pattern[i] !== '*'; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false
      }
    }

    let lastIndex = i
    for (let p = 0; p < starCount - 1; p++) {
      i++
      let subPattern = ''
      while (pattern[i] !== '*') {
        subPattern += pattern[i]
        // 星星移动进一位
        i++
      }

      let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g')
      reg.lastIndex = lastIndex
      reg.exec(source)
      lastIndex = reg.lastIndex
    }

    for (let j = 0; j < source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
      if (pattern[pattern.length - j] !== source[source.length - 1] && pattern[pattern.length - j] !== '?') {
        return false
      }
      return true
      
    }
  }
}