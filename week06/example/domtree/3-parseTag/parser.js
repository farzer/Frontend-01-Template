const EOF = Symbol('EOF') // EOF: End of File

const RegMap = {
  enWord: /^[a-zA-Z]$/,
  space: /^[\t\n\f ]$/
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

  function data(c) {
    if (c === '<') {
      return tagOpen
    } else if (c === EOF) {
      return EOF;
    } else {
      return data
    }
  }

  function tagOpen(c) {
    if (c === '/') {
      return endTagOpen;
    } else if (c.match(RegMap.enWord)) {
      return tagName(c)
    }

    return
  }

  function tagName(c) {
    if (c.match(RegMap.space)) {
      return beforeAttributeName
    } else if (c === '/') {
      return selfClosingStartTag;
    } else if (c.match(RegMap.enWord)) {
      return tagName
    } else if (c === '>') {
      return data
    }

    return tagName
  }

  function beforeAttributeName(c) {
    if (c.match(RegMap.space)) {
      return beforeAttributeName
    } else if (c === '>') {
      return data
    } else if (c === '=') {
      return beforeAttributeName
    }

    return beforeAttributeName
  }

  function selfClosingStartTag(c) {
    if (c === '>') {
      return data
    } else if (c === 'EOF') {

    } else {

    }
  }

  function endTagOpen(c) {
    if (c.match(RegMap.enWord)) {
      return tagName(c)
    } else if (c === '>') {
      
    } else if (c == EOF) {
      
    }
  }

  let state = data

  for (const c of html) {
    state = state(c)
  }

  state = state(EOF)

  return state;
}

module.exports.parseHTML = parseHTML