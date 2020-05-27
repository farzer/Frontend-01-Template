const css = require('css')
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
  const rules = []
  const tokenArr = []
  const stack = [{ type: 'document', children: [] }]
  let currentToken = null
  let currentTextNode = null
  let currentAttribute = null

  function emit(token) {
    tokenArr.push(token)
    let top = stack[stack.length - 1]

    if (token.type === 'startTag') {
      let element = {
        type: 'element',
        children: [],
        attributes: []
      }

      element.tagName = token.tagName

      for (const p in token) {
        if (p !== 'type' && p !== 'tagName') {
          element.attributes.push({
            name: p,
            value: token[p]
          })
        }
      }

      top.children.push(element)
      element.parent = top;

      if (!token.isSelfClosing) {
        stack.push(element)
      }

      currentTextNode = null
    } else if (token.type === 'endTag') {
      if (top.tagName !== token.tagName) {
        throw new Error('开始结束标签不匹配')
      }

      // 收集 css
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content)
      }

      stack.pop()
      currentTextNode = null
    } else if (token.type === 'text') {
      if (currentTextNode === null) {
        currentTextNode = {
          type: 'text',
          content: ''
        }

        top.children.push(currentTextNode)
      }

      currentTextNode.content += token.content
    }

    // 打印 所有非 text token
    if (token.type !== 'text') {
      // console.log(token)
    }
  }

  function addCssRules(content) {
    const ast = css.parse(content)
    rules.push(...ast.stylesheet.rules)
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
      // console.log('为 Null 错误')
      return error
    } else if (c === '\"' || c === "'" || c === '<') {
      // console.log('解析属性名错误')
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

  // console.log(stack)

  return {state, tokenArr, rules};
}

module.exports.parseHTML = parseHTML