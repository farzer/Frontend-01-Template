const EOF = Symbol('EOF') // EOF: End of File

const RegMap = {
  enWord: /^[a-zA-Z]$/,
  space: /^[\t\n\f ]$/
}

// state:
// - data
// - tagOpen
// - endTagOpen
// - tagName
// - beforeAttributeName
// - afterAttributeName
// - selfClosingStartTag
// - beforeAttributeValue
// - doubleQuotedAttributeValue
// - singleQuotedAttributeValue
// - unquotedAttributeValue
// - afterQuotedAttributeValue


function parseHTML(html) {

  const tokenArr = []

  let currentToken = null

  let currentAttribute = null

  function emit(token) {
    tokenArr.push(token)
    if (token.type !== 'text') {
      // console.log(token)
    }
  }

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
    } else if (c === '\u0000') {
      return error
    } else if (c === EOF) {
      
    }

    return tagName

  }

  // (空格) 继续等待属性
  // 
  function beforeAttributeName(c) {
    if (c.match(RegMap.space)) {
      // 忽略这个字符
      return beforeAttributeName
    } else if (c === '/' || c === '>' || c === EOF) {
      return afterAttributeName(c)
    } else if (c === '=') {
      return error
    }

    // 开始在当前的 token 中创建一个新的 attribute
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }

  function afterAttributeName(c) {
    if (c.match(RegMap.space)) {
      return afterAttributeName
    } else if (c === '/') {
      return selfClosingStartTag
    } else if (c === '=') {
      return beforeAttributeValue
    } else if (c === '>') {
      emit(currentToken)
      return data
    } else if (c === EOF) {
      return EOF
    }

    // 开始在当前的 token 中创建一个新的 attribute
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }


  function attributeName(c) {
    if (c.match(RegMap.space) || c === '/' || c === '>' || c === EOF) {
      return afterAttributeName(c)
    } else if (c === '=') {
      return beforeAttributeValue
    } else if (c === '\u0000') {
      console.log('为 Null 错误')
      return error
    } else if (c === '\"' || c === "'" || c === '<') {
      console.log('解析属性名错误')
      return error
    }

    currentAttribute.name += c;
    return attributeName
  }

  function beforeAttributeValue(c) {
    if (c.match(RegMap.space) || c === '/' || c === '>' || c === EOF) {
      // Ignore the character.
      return beforeAttributeValue
    } else if (c === '\"') {
      return doubleQuotedAttributeValue
    } else if (c === '\'') {
      return singleQuotedAttributeValue
    } else if (c === '>') {
      emit(currentToken)
      return data
    }

    return unquotedAttributeValue(c)
  }

  function doubleQuotedAttributeValue(c) {
    if (c === '\"') {
      currentToken[currentAttribute.name] = currentAttribute.value
      return afterQuotedAttributeValue
    } else if (c === '\u0000') {
      
    } else if (c === EOF) {

    }

    currentAttribute.value += c;
    return doubleQuotedAttributeValue
  }

  function singleQuotedAttributeValue(c) {
    if (c === '\'') {
      currentToken[currentAttribute.name] = currentAttribute.value
      return afterQuotedAttributeValue
    } else if (c === '\u0000') {
      
    } else if (c === EOF) {

    }

    currentAttribute.value += c;
    return singleQuotedAttributeValue
  }

  function afterQuotedAttributeValue(c) {
    if (c.match(RegMap.space)) {
      return beforeAttributeName
    } else if (c === '/') {
      return selfClosingStartTag
    } else if (c === '>') {
      emit(currentToken)
      return data;
    } else if (c === EOF) {
      
    }

    return beforeAttributeName(c)
  }

  function unquotedAttributeValue(c) {
    if (c.match(RegMap.space)) {
      currentToken[currentAttribute.name] = currentAttribute.value
      return beforeAttributeName
    } else if (c === '/') {
      currentToken[currentAttribute.name] = currentAttribute.value
      return selfClosingStartTag
    } else if (c === '>') {
      currentToken[currentAttribute.name] = currentAttribute.value
      emit(currentToken)
      return data
    } else if (c === '\u0000') {
      return error
    } else if (c === '\"' || c === '\"' || c === '<' || c === '=' || c === '`') {
      
    } else if (c === EOF) {

    }

    currentAttribute.value += c
    return unquotedAttributeValue
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

  return {state, tokenArr};
}

module.exports.parseHTML = parseHTML