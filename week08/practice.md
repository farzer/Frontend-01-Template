## 选择器优先级

- div#a.b .c[id=x]
  - div [0, 0, 0, 1]
  - div#a [0, 1, 0, 1]
  - div#a.b [0, 1, 1, 1]
  - div#a.b .c [0, 1, 2, 1]
  - div#a.b .c [0, 1, 3, 1]
- #a:not(#b)
  - #a [0, 1, 0, 0]
  - #a:not(#b) [0, 2, 0, 0] // :not 使用参数中的选择器的优先级
*.a
  - * [0, 0, 0, 0] // * 号不参与计算
  - *.a [0, 0, 1, 0]
div.a
  - div [0, 0, 0, 1]
  - div.a [0, 0, 1, 1]


### 伪类

- 链接/行为
  - :any-link 带有href的链接
  - :link :visited
  - :hover
  - :active
  - :foucus
  - :target
- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child :last-child :only-child