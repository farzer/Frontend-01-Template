const css = require('css')
const layout = require('./layout')
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

      computeCss(element)

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

      layout(top)
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

  /**
   * 收集 css 规则
   * @param {string} content css 样式文本
   */
  function addCssRules(content) {
    const ast = css.parse(content)
    rules.push(...ast.stylesheet.rules)
  }

  /**
   * 检测当前元素是否和给定的选择器匹配
   * @param {object} element 检测元素
   * @param {string} selector 当前选择器
   */
  function match(element, selector) {
    if (!selector || !element.attributes) {
      return false
    }

    // id
    if (selector.charAt(0) === '#') {
      const attr = element.attributes.filter(attr => attr.name === 'id')[0]
      if (attr && attr.value === selector.replace('.', '')) {
        return true
      }
    } else if (selector.charAt(0) === '.') { // 类名
      const attr = element.attributes.filter(attr => attr.name === 'class')[0]
      if (attr && attr.value === selector.replace('.', '')) {
        return true
      }
    }

    // 元素选择器
    if (element.tagName === selector) {
      return true
    }

    return false
  }

  function computeCss(element) {
    // 从当前向父元素寻找
    const elements = stack.slice().reverse()

    if (!element.computedStyle) {
      element.computedStyle = {}
    }

    // [
    //   {
    //     "type": "rule",
    //     "selectors": [
    //       "body div #myid"
    //     ],
    //     "declarations": [
    //       {
    //         "property": "width",
    //         "value": "100px",
    //       },
    //       {
    //         "property": "background-color",
    //         "value": "#ff5000",
    //       }
    //     ],
    //   },
    //   {
    //     "type": "rule",
    //     "selectors": [
    //       "body div img"
    //     ],
    //     "declarations": [
    //       {
    //         "property": "width",
    //         "value": "30px",
    //       },
    //       {
    //         "property": "background-color",
    //         "value": "#ff1111",
    //       }
    //     ],
    //   }
    // ]

    for (const rule of rules) {
      let matched = false
      // 保持和 element 的顺序一致
      const selectorParts = rule.selectors[0].split(' ').reverse()

      // 如果最后一个规则符号不匹配，直接开始检测下一条规则
      // 比如 div a #id => ['#id', 'a', 'div']
      // 如果当前元素无法匹配上 #id 的条件就不会命中规则了
      if (!match(element, selectorParts[0])) {
        continue
      }

      // 命中最后一个符号，如上例 #id，则从 a 开始继续匹配
      let j = 1

      for (let i = 0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
          j++
        }
      }

      if (j >= selectorParts.length) {
        matched = true
      }

      if (matched) {
        // 计算 sp
        const sp = specificity(rule.selectors[0])
        // 如果匹配到
        const computedStyle = element.computedStyle
        for (const declaration of rule.declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {}
          }
          
          if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = sp
          } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
            computedStyle[declaration.property].value = declaration.value
            computedStyle[declaration.property].specificity = sp
          }
        }
        // console.log(element.computedStyle);
      }
    }
  }

  function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
      return sp1[0] - sp2[0]
    }

    if (sp1[1] - sp2[1]) {
      return sp1[1] - sp2[1]
    }

    if (sp1[2] - sp2[2]) {
      return sp1[2] - sp2[2]
    }

    return sp1[3] - sp2[3]
  }

  function specificity(selector) {
    const p = [0, 0, 0, 0]
    const selectorParts = selector.split(' ')
    for (const part of selectorParts) {
      if (part.charAt(0) === '#') {
        p[1] += 1
      } else if (part.charAt(0) === '.') {
        p[2] += 1
      } else {
        p[3] += 1
      }
    }

    return p
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

  return {state, tokenArr, rules, stack};
}

module.exports.parseHTML = parseHTML