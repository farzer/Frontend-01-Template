function create(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls)
  } else {
    o = new Cls({
      timer: {}
    })
  }

  for (let name in attributes){
    o.setAttribute(name, attributes[name])
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = new Text(child)
    }
    o.appendChild(child)
  }
  return o;
}

class Text {
  constructor(text) {
    this.root = document.createTextNode(text)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class Wrapper {
  constructor(type){
    console.log('Wrapper::config ', type)
    this.children = [];
    this.root = document.createElement(type)
  }
  set class(v) { // propery
    console.log("Wrapper::class ", v)
  }

  setAttribute(name, val) {
    console.log('Wrapper::setAttribute ', name, val)
    this.root.setAttribute(name, val)
  }

  appendChild(child) {
    console.log('Wrapper::child', child)
    this.children.push(child)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }
}

class Div {
  constructor(config){
    console.log('Div::config ', config)
    this.children = [];
    this.root = document.createElement('div')
  }
  set class(v) { // propery
    console.log("Div::class ", v)
  }

  setAttribute(name, val) {
    console.log('Div::setAttribute ', name, val)
    this.root.setAttribute(name, val)
  }

  appendChild(child) {
    console.log('Div::child', child)
    this.children.push(child)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }
}

class MyComponent {
  constructor(config){
    console.log('Div::config ', config)
    this.children = [];
    this.root = document.createElement('div')
  }
  set class(v) { // propery
    console.log("Div::class ", v)
  }

  setAttribute(name, val) {
    console.log('Div::setAttribute ', name, val)
    this.root.setAttribute(name, val)
  }

  appendChild(child) {
    console.log('Div::child', child)
    this.children.push(child)
  }

  render() {
    return <article>
      <header>I'm a header</header>
      {this.slot}
      <footer>I'm a footer</footer>
    </article>
  }

  mountTo(parent) {
    this.slot = <div></div>

    for (const child of this.children) {
      this.slot.appendChild(child)
    }

    this.render().mountTo(parent)
  }
}

let component = <MyComponent><Div id="ghj" name="cls">
  <div class="test"></div>
  <p class="p">hello</p>
  <Div></Div>
  <Div></Div>
</Div>
</MyComponent>

component.mountTo(document.body)

console.log(component)
