const Trie = require('./1')

describe('Test Trie', () => {
  let trie = null

  function randomWord(len) {
    let s = ''
    for (let index = 0; index < len; index++) {
      s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0))
    }
    return s
  }

  beforeEach(() => {
    trie = new Trie
  })
  it('should has root', () => {
    expect(trie.root).toBeDefined()
  });

  it('should max correct', () => {
    trie.insert('hello')
    trie.insert('hello')
    trie.insert('hello')
    trie.insert('hello')
    trie.insert('hello')
    trie.insert('hello')
    expect(trie.max()[0]).toBe(6)
    expect(trie.max()[1]).toBe('hello')
  });
});