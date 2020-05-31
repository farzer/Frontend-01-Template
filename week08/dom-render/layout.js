function layout(element) {
  // 如果没有样式不做处理
  if (!element.computedStyle) {
    return;
  }

  // 预处理样式，添加 style 属性
  const elementStyle = getStyle(element)

  // 当前仅处理 flex 布局
  if (elementStyle.display !== 'flex') {
    return
  }

  if (element.attributes && element.attributes[0]) {
    if (element.attributes[0].value === 'c1') {
      // green
      console.log(element)
    } else if (element.attributes[0].value === 'myid') {
      // red
      console.log(element)
    }
  }

  // 只处理 element 类型的元素
  const items = element
    .children
    .filter(e => e.type === 'element')

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  const style = elementStyle;

  // 如果没有设置 width/height, 置空 width 和 height
  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  // 1. 设置默认值
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
    style.flexWrap = 'nowrap'
  }

  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch'
  }

  // size 尺寸大小，width/height
  // start 位置 主轴表示 left/right 交叉轴表示 top/bottom
  // end 和 start 相反
  // sign
  // base 绘制起点
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
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  } else if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  } else if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  // 影响交叉轴
  if (style.flexWrap === 'wrap-reverse') {
    const tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = +1
  }

  /**
   * 第三步 收集行
   */

  // 先处理特殊情况
  // 容器没有设置 mainSize，也就是没有设置 width 或者 height
  let isAutoMainSize = false
  if (!style[mainSize]) { // auto sizing
    elementStyle[mainSize] = 0
    // 计算子元素的大小
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
      }
    }

    isAutoMainSize = true
  }

  let flexLine = []
  let flexLines = [flexLine]
  // 行中剩余空间，初始化为元素的 mainSize 大小
  let mainSpace = elementStyle[mainSize]
  // 交叉轴每一行的空间
  let crossSpace = 0

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null || itemStyle[mainSize] === (void 0)) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      // 如果有 flex 属性，说明 子项目 肯定能够放进一行内
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      // 处理不换行并且是自动大小的情况
      // 项目放进行，剩余空间减去该项目大小
      flexLine.push(item)
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        // 交叉轴行高取决于最大项目的高度
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }

    } else {
      // 项目比容器空间大的话，设置项目的空间大小和容器一致
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      // 主空间不足
      if (mainSpace < itemStyle[mainSize]) {
        // 存储当前计算行时主轴剩余空间
        flexLine.mainSpace = mainSpace
        // 存储当前计交叉轴空间
        flexLine.crossSpace = crossSpace
        // 创建新的一行
        flexLine = [item]
        // 存储新的行，并重置主轴和交叉轴空间大小
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }

      // 设置交叉轴空间
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }

      // 主轴剩余空间减去当前项目的空间大小
      mainSpace -= itemStyle[mainSize]
    }
  }

  // 计算完剩余空间后，设置当前计算行的剩余空间
  flexLine.mainSpace = mainSpace

  // 如果不换行或者自动计算，设置当前计算行的交叉轴空间
  // 如果容器有设置交叉轴空间大小，设置为该容器的交叉轴空间大小
  // 否则设置计算到的（最大项目交叉轴空间）交叉轴空间大小
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== (void 0))
      ? style[crossSize]
      : crossSpace
  } else {
    // 如果换行, 设置计算到的交叉轴空间大小
    flexLine.crossSpace = crossSpace
  }

  /**
   * 第三步 计算主轴（计算项目的 start 和 end）
   */

  // 只会发生在单行里面，否则一定会分多行
  if (mainSpace < 0) {
    // 项目调整伸缩比例
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    // 设置当前行的起点
    let currenetMain = mainBase
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const itemStyle = getStyle(item)

      // 如果项目是 flex，初始化空间大小为 0
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      // 设置项目的伸缩后的空间大小
      itemStyle[mainSize] = itemStyle[mainSize] * scale
      // 设置项目在主轴上的开始位置
      itemStyle[mainStart] = currenetMain
      // 设置项目在主轴上的结束位置
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    } 
  } else { // 多行
    flexLines.forEach(flexLine => {
      // 当前行剩余空间
      let mainSpace = flexLine.mainSpace

      // 收集 flex 项目数量
      let flexTotal = 0
      for (let index = 0; index < flexLine.length; index++) {
        const item = flexLine[index];
        const itemStyle = getStyle(item)
        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
        }
      }

      if (flexTotal > 0) {
        // 表示有弹性的项目，重新计算 start 和 end
        let currentMain = mainBase
        for (let index = 0; index < flexLine.length; index++) {
          const item = flexLine[index];
          const itemStyle = getStyle(item)
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }
          // 设置新的 start 和 end
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          // 设置新的起点
          currentMain = itemStyle[mainEnd]
        }
      } else {
        // 如果项目没有 flex, 则 justifyContent 生效
        let currentMain // 当前元素在主轴的位置
        let mainGap // 元素间距
        
        // 初始化起点和间隔
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          // 元素间距
          mainGap = 0
        }

        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          mainGap = 0
        }

        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          mainGap = 0
        }

        if (style.justifyContent === 'space-between') {
          // 中间间隙会比项目数量少 1
          mainGap = mainSpace / (flexLine.length - 1) * mainSign
          currentMain = mainBase
        }

        if (style.justifyContent === 'space-around') {
          // 左右两个间隙是中间间隙的一半
          // 左右两个间隙可以当做是中间一个间隙，这样就是有多少个项目就有多少间隙
          mainGap = mainSpace / flexLine.length * mainSign
          // 第一个项目左边是半个间隙
          currentMain = mainGap / 2 + mainBase
        }

        for (let index = 0; index < flexLine.length; index++) {
          const item = flexLine[index];
          const itemStyle = getStyle(item)

          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          // 项目间有一个间隔
          currentMain = itemStyle[mainEnd] + mainGap
        }
      }
    })
  }

  /**
   *第四步 计算交叉轴
   * 涉及 align-items / align-self
   */

  // 如果交叉轴没有设置大小
  if (!style[crossSize]) {
    crossSpace = 0
    style[crossSize] = 0
    for (let index = 0; index < flexLines.length; index++) {
      const flexLine = flexLines[index]
      style[crossSize] = style[crossSize] + flexLine.crossSpace;
    }
  } else {
    // 剩余空间
    crossSpace = style[crossSize]
    for (let index = 0; index < flexLines.length; index++) {
      const flexLine = flexLines[index]
      crossSpace -= flexLine.crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  // 每行空间
  let lineSize = style[crossSize] / flexLines.length

  // 每行间隔
  let crossGap

  if (style.alignContent === 'flex-start') {
    crossBase += 0
    crossGap = 0
  }

  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    crossGap = 0
  }

  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
    crossGap = 0
  }

  if (style.alignContent === 'space-between') {
    crossBase += 0
    crossGap = crossSpace / (flexLines.length - 1) * crossSign
  }

  if (style.alignContent === 'space-around') {
    crossGap = crossSpace / (flexLines.length) * crossSign
    crossBase += crossSign * crossGap / 2
  }

  if (style.alignContent === 'stretch') {
    crossBase += 0
    crossGap = 0
  }

  flexLines.forEach(flexLine => {
    // strech 会让全部行占据整个容器的高度
    // crossSpace 是每行剩余空间
    const lineCrossSize = style.alignContent === 'stretch'
      ? flexLine.crossSpace + crossSpace / flexLines.length
      : flexLine.crossSpace
    for (let index = 0; index < flexLine.length; index++) {
      const item = flexLine[index];
      const itemStyle = getStyle(item)
      const align = itemStyle.alignSelf || style.alignItems

      // 如果没有设置交叉轴空间
      if (itemStyle[crossSize] === null || itemStyle[crossSize] === void 0) {
        itemStyle[crossSize] = (align === 'stretch')
          ? lineCrossSize
          : 0
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + itemStyle[crossSize] * crossSign
      }

      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
      }

      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
        itemStyle[crossEnd] = itemStyle[crossStart] - crossSign * itemStyle[crossSize]
      }

      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
          ? itemStyle[crossSize]
          : lineCrossSize)
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }

    crossBase += crossSign * (lineCrossSize + crossGap)
  })
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