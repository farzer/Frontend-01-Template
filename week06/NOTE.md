## 状有限态机

- 每个状态都是一个机器
  - 所有的机器接受的输入是一致的
  - 状态机的每个机器本身没有状态，对应纯函数
- 每个机器知道下一个状态
  - 每个机器都有确定的下一个状态（moore状态机）
  - 每个机器根据输入决定下一个状态（mealy状态机）

### mealy 状态机

每个函数是一个状态

```js
function state(c) {
  // 自动编码实现逻辑
  return next;
}

// 调用
while(input) {
  state = state(input)
}
```

## HTML 解析