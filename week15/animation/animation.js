export class Timeline {
  constructor() {
    this.animations = []
  }
  tick() {
    const t = Date.now() - this.startTime
    for (const animation of this.animations) {
      if (t > animation.duration + animation.delay) {
        continue
      }
      let { object, property, start, end, timingFunction, delay, template } = animation
      object[property] = template(timingFunction(start, end)(t - delay))
    }
    requestAnimationFrame(() => {
      this.tick()
    })
  }

  start() {
    this.startTime = Date.now()
    this.tick()
  }

  add(animation) {
    this.animations.push(animation)
  }
}

export class Animation {
  constructor(object, property, template, start, end, duration, delay, timingFunction) {
    this.object = object
    this.template = template
    this.property = property
    this.start = start;
    this.end = end;
    this.duration = duration
    this.delay = delay || 0
    this.timingFunction = timingFunction || this.defaultTimingFunction
  }
  defaultTimingFunction = (start, end) => {
    return (t) => start + (t / this.duration) * (end - start)
  }
}

/**
 * let animation1 = new Animation(config)
 * let animation2 = new Animation(config)
 * let timeline = new Timeline
 * timeline.add(animation1)
 * timeline.add(animation2)
 * timeline.start()
 * timeline.stop()
 * timeline.pause()
 * timeline.resume()
 */