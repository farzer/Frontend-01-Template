export class Timeline {
  constructor() {
    this.animations = []
    this.requestId = null
    this.state = 'inited'
    this.tick = () => {
      let t = Date.now() - this.startTime
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
        this.requestId = requestAnimationFrame(this.tick)
      }
    }
  }

  pause() {
    if (this.state !== 'playing') {
      return
    }
    this.state = 'paused'
    this.pauseTime = Date.now()
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId)
    }
  }

  resume() {
    if (this.state !== 'paused') {
      return
    }
    this.state = 'resume'
    this.startTime += Date.now() - this.pauseTime;
    this.tick()
  }

  start() {
    if (this.state !== 'inited') {
      return
    }
    this.state = 'playing'
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