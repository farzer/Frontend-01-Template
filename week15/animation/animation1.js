export class Timeline {
  constructor() {
    this.animations = []
  }
  tick() {
    let t = Date.now() - this.startTime
    console.log(t)
    let animations = this.animations.filter(ani => !ani.finished)
    for (const animation of this.animations) {
      let { object, property, start, end, timingFunction, delay, template, duration } = animation
      let progression = timingFunction((t - delay) / duration)
      if (t > animation.duration + animation.delay) {
        progression = 1
        animation.finished = true
      }
      let value = start + progression * (end - start)
      object[property] = template(value)
    }
    if (animations.length) {
      requestAnimationFrame(() => this.tick())
    }
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
    this.delay = delay
    this.timingFunction = timingFunction
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