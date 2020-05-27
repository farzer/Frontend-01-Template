const EOF = Symbol('EOF') // EOF: End of File

const RegMap = {
  enWord: /^[a-zA-Z]$/,
  space: /^[\t\n\f ]$/
}

function emit(token) {
  // if (token.type !== 'text') {
  //   console.log(token)
  // }
  // console.log(token)
}

// state:
// 0. data
// 1. tagOpen
// 2. endTagOpen
// 3. tagName
// 4. beforeAttributeName
// 5. selfClosingStartTag

function parseHTML(html) {

  const stateStack = []

  let currentToken = null

  function data(c) {
    if (c === '<') {
      return tagOpen
    } else if (c === EOF) {
      emit({
        type: 'EOF'
      })
      return EOF;
    } else {
      emit({
        type: 'text',
        content: c
      })
      return data
    }
  }

  function tagOpen(c) {
    if (c === '/') {
      currentToken = {
        type: 'endTag',
        tagName: ''
      };
      return endTagOpen;
    } else if (c.match(RegMap.enWord)) {
      currentToken = {
        type: 'startTag',
        tagName: ''
      }
      return tagName(c)
    }

    return data
  }

  // <html (空格) 准备输入属性名
  // <html> 结束标签名
  // <br /  自闭合标签
  function tagName(c) {
    if (c.match(RegMap.space)) {
      return beforeAttributeName
    } else if (c === '/') {
      return selfClosingStartTag;
    } else if (c.match(RegMap.enWord)) {
      currentToken.tagName += c
      return tagName
    } else if (c === '>') {
      emit(currentToken)
      return data
    }

    return tagName

  }

  function beforeAttributeName(c) {
    if (c.match(RegMap.space)) {
      return beforeAttributeName
    } else if (c === '>') {
      emit(currentToken)
      currentToken = null
      return data
    } else if (c === '=') {
      return beforeAttributeName
    } else if (c === '/') {
      return selfClosingStartTag
    }

    return beforeAttributeName
  }

  // > 闭合完成
  // EOF 文件结束
  function selfClosingStartTag(c) {
    if (c === '>') {
      currentToken.isSelfClosing = true
      emit(currentToken)
      return data
    } else if (c === 'EOF') {

    } else {

    }
  }

  function endTagOpen(c) {
    if (c.match(RegMap.enWord)) {
      return tagName(c)
    } else if (c === '>') {
      currentToken.type = 'endTagOpen'
      emit(currentToken)
      currentToken = null
    } else if (c == EOF) {
      currentToken = null
    }
  }

  function error() {
    throw new Error('Parse Error')
  }

  let state = data

  for (const current of html) {
    state = state(current)
  }

  state = state(EOF)

  return state;
}

module.exports.parseHTML = parseHTML