const EOF = Symbol('EOF') // EOF: End of File

function parseHTML(html) {
  
  function data(c) {

  }

  let state = data

  for (const c of html) {
    state = state(c)
  }

  state = state(EOF)
}

module.exports.parseHTML = parseHTML