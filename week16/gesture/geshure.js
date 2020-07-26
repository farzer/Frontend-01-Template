let element = document.body

let contexts = Object.create(null)

let MOUSE_SYMBOL = Symbol('mouse')

if (document.ontouchstart !== null) {
  element.addEventListener('mousedown', (event) => {
    contexts[MOUSE_SYMBOL] = Object.create(null)
    start(event, contexts[MOUSE_SYMBOL])
    let mousemove = event => {
      move(event, contexts[MOUSE_SYMBOL])
    }
  
    let mouseend = event => {
      end(event, contexts[MOUSE_SYMBOL])
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseend)
    }
  
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseend)
  })
  
  element.addEventListener('touchstart', event => {
    for (const touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null)
      start(touch, contexts[touch.identifier])
    }
  })
  
  element.addEventListener('touchmove', event => {
    for (const touch of event.changedTouches) {
      move(touch, contexts[touch.identifier])
    }
  })
  
  element.addEventListener('touchend', event => {
    for (const touch of event.changedTouches) {
      end(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })
  
  element.addEventListener('touchcancel', event => {
    for (const touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })
  
  // tap
  // pan: panstart panmove panend
  // flick/swipe
  // press: pressstart pressend
  
  let start = (point, context) => {
    context.startX = point.clientX
    context.startY = point.clientY
    context.moves = []
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) {
        return
      }
      context.isTap = false
      context.isPan = false
      context.isPress = true
      console.log('pressstart')
    }, 500);
  }
  let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY
    // 移动距离大于 10px，10px 也可以根据 dpr 做适配
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        console.log('presscancel')
      }
      context.isTap = false
      context.isPan = true
      context.isPress = false
      console.log('panstart')
    }

    if (context.isPan) {
      context.moves.push({
        dx,
        dy,
        t: Date.now()
      })
      // 只记录最后300毫秒
      context.moves = context.moves.filter(record => Date.now() - record.t < 300)
      console.log('pan')
    }
  }
  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX, dy = point.clientY - context.startY
      const record = context.moves[0]
      const speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t)
      if (speed > 2.5) {
        console.log('flick')
      }
      console.log('panend')
    }
    if (context.isTap) {
      console.log('tap')
    }
    if (context.isPress) {
      console.log('pressend')
    }
  
    clearTimeout(context.timeoutHandler)
  }
  let cancel = () => {
    console.log('cancel')
    clearTimeout(context.timeoutHandler)
  }
}

