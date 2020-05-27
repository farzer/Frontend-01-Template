function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  const elementStyle = getStyle(element)

  // 当前仅处理 flex 布局
  if (elementStyle.display !== 'flex') {
    return
  }

  const items = element.children.filter(e => e.type === 'element')

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  const style = elementStyle

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  // 设置默认值
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }

  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch'
  }

  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }

  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'no-wrap'
  }

  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch'
  }

  let mainSize // 尺寸 width, height
  let mainStart // left, right
  let mainEnd // left, right
  let mainSign // 左到右 为 +1，否则为 -1
  let mainBase // 排版的起点
  let crossSize
  let crossStart
  let crossEnd
  let crossSign
  let crossBase

  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = 1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = 1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    const tmp = crossStart
    crossStart = crossEnd
    crossEnd = template
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  // 容器没有设置 mainSize，也就是没有设置 width 或者 height
  let isAutoMainSize = false
  if (!style[mainSize]) { // auto sizing
    elementStyle[mainSize] = 0
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
      }
    }

    isAutoMainSize = true
  }

  const flexLine = []
  const flexLines = [flexLine]
  const mainSpace = elementStyle[mainSize] // 剩余空间，初始化为 mainSize
  const crossSpace = 0 // 每行交叉轴空间

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null || itemStyle[mainSize] === void 0) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }

      flexLine.push(item)
    } else {
      // 项目比容器宽
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }

      mainSpace -= itemStyle[mainSize]
    }
  }

  flexLine.mainSpace = mainSpace

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== void 0) ? style[crossSize] : crossSize
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    // overflow
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    var currenetMain = mainBase
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale
      itemStyle[mainStart] = currenetMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    } else { // 多行
      flexLines.forEach(items => {
        let mainSpace = items.mainSpace
        let flexTotal = 0
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          const itemStyle = getStyle(item)
          if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
            flexTotal += itemStyle.flex;
            continue
          }
        }

        if (flexTotal > 0) {
          // 表示有弹性的项目
          let currentMain = mainBase
          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item)
            if (itemStyle.flex) {
              itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
            }
            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd]
          }
        } else {
          let currentMain // 当前元素在主轴的位置
          let step // 元素间距
          // 没有 flex 属性
          if (style.justifyContent === 'flex-start') {
            currentMain = mainBase
            // 元素间距
            step = 0
          }

          if (style.justifyContent === 'flex-end') {
            currentMain = mainSpace * mainSign + mainBase
            step = 0
          }

          if (style.justifyContent === 'center') {
            currentMain = mainSpace / 2 * mainSign + mainBase
            step = 0
          }

          if (style.justifyContent === 'space-between') {
            step = mainSpace / (items.length -1) * mainSign
            currentMain = mainBase
          }

          if (style.justifyContent === 'space-around') {
            step = mainSpace / items.length * mainSign
            currentMain = step / 2 + mainBase
          }

          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd] + step
          }
        }
      })

    }
  }
}

function getStyle(element) {
  // 如果没有样式就添加一个默认样式
  if (!element.style) {
    element.style = {}
  }

  // 将数字字符串相关属性的值转为数字，方便后面数字计算
  for (const prop in element.computedStyle) {
    // const p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }

    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }

  return element.style
}

module.exports = layout