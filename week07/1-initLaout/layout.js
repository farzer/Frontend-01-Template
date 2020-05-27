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