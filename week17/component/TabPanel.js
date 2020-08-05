import {create, Text, Wrapper} from './createElement'

export class TabPanel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map()
    this.properties = new Map()
    this.state = Object.create(null)
  }

  setAttribute(name, val) {
    this[name] = val
  }

  getAttribute(name) {
    return this[name]
  }

  appendChild(child) {
    this
      .children
      .push(child)
  }

  select(i) {
    for (const view of this.childViews) {
      view.style.display = 'none'
    }
    this.childViews[i].style.display = ''
    for (const view of this.titleView) {
      view.classList.remove = 'selected'
    }
    this.titleView[i].classList.add('selected')
    // this.titleView.innerText = this.children[i].title
  }

  render() {
    this.childViews = this
      .children
      .map(child => <div style="width: 300px; min-height: 300px;">{child}</div>)
    this.titleView = this.children.map((child, i) => <span
      onClick={() => this.select(i)}
      style="background-color: lightgreen;width: 300px;margin: 0; margin-right: 10px">{child.getAttribute('title')}</span>)

    setTimeout(() => {
      this.select(0)
    }, 16);

    return <div class="tab-panel" style="border: solid 1px lightgreen; width: 300px;">
      {this.titleView}
      <hr />
      <div>
        {this.childViews}
      </div>
    </div>
  }

  mountTo(parent) {
    this
      .render()
      .mountTo(parent)
  }
}