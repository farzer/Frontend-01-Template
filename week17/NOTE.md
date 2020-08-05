# 每周总结可以写在这里

### 组件

对象：properties/methods/inherit
组件：properties/methods/inherit/attribute/config&state/event/lifecycle/children

### y combinator

```javascript
let y = g =>
  (f => f(f))(
    self =>
      g( (...args) => self(self).apply(this, args) )
  )

let f = y(self => {
  return n => n > 0 ? self(n - 1) + n : 0
})

f(100)
```

### yo

1. 收集信息
2. npm
3. 文件系统
4. 模板