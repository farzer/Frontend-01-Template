import {create, Text, Wrapper} from './createElement'
import {Timeline, Animation} from './animation'
import {ease} from './cubicBezier'
import {enableGesture} from './geshure'

export class Panel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map()
    this.properties = new Map()
  }

  setAttribute(name, val) {
    this[name] = val
  }

  appendChild(child) {
    this
      .children
      .push(child)
  }

  render() {
    let root = <div class="panel" style="border: solid 1px lightgreen; width: 300px;">
      <h1 style="background-color: lightgreen; width: 300px; margin: 0">{this.title}</h1>
      <div style="width: 300px; min-height: 300px;">
        {this.children}
      </div>
    </div>
    return root
  }

  mountTo(parent) {
    this
      .render()
      .mountTo(parent)
  }
}