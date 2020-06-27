class Trie {
  constructor() {
    this.root = Object.create(null)
  }

  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node[c]) {
        node[c] = Object.create(null)
      }
      // 递增节点
      node = node[c]
    }

    if (!('$' in node)) {
      node['$'] = 0
    }
    node['$']++
  }
  max() {
    let max = 0, maxWord = ''
    function visit(node, word) {
      if (node['$'] && node['$'] > max) {
        max = node['$']
        maxWord = word
      }
      for (const p in node) {
        visit(node[p], word + p)
      }
    }
    visit(this.root, '')
    return [max, maxWord]
  }
}

module.exports = Trie