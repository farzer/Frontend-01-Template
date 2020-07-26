const parser = require('./parser')

module.exports = function(source, map) {
  const tree = parser.parseHTML(source)
  // console.log(tree.children[1].children[0].content)

  let template = null;
  let script = null

  for (const node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type != 'text')[0]
    } else if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }

  let visit = (node) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content)
    }
    let attrs = {}
    for (const attribute of node.attributes) {
      attrs[attribute.name] = attribute.value
    }
    let children = node.children.map(node => visit(node))
    return `create("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  }

  const r = `
import { Text, Wrapper, create } from './createElement'
export class Carousel {
  setAttribute(name, value) { //attribute
    this[name] = value;
  }
  mountTo(parent) {
    this.render().mountTo(parent)
  }
  render() {
    return ${visit(template)}
  }
}
  `
  console.log(r)
  return r
}