const handlers = new Map()
let usedReactivities = []
// 当 reactive 调用的时候，先查是否已存在，即相当于缓存的作用
const reactivities = new Map()

function reactive(obj) {
  if (reactivities.has(obj)) {
    return reactivities.get(obj)
  }
  const proxy = new Proxy(obj, {
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop])
      }
      return obj[prop]
    },
    set(obj, prop, value) {
      obj[prop] = val;
      if (handlers.get(obj)) {
        if (handlers.get(obj).get(prop)) {
          for (const handle of handlers.get(obj).get(prop)) {
            handle()
          }
        }
      }
      return obj[prop]
    }
  })

  reactivities.set(obj, proxy)
  reactivities.set(proxy, proxy)

  return proxy
}

function effect(handler) {
  usedReactivities = []
  handler()
  for (const usedReactivity of usedReactivities) {
    let [obj, prop] = usedReactivity
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map())
    }

    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, [])
    }

    handlers.get(obj).get(prop).push(handler)
  }
}

module.exports = {
  effect,
  reactive
}