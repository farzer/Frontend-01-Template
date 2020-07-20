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
    o.appendChild(child)
  }
  return o;
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

let component = <Div id="ghj" name="cls">
  <div class="test"></div>
  <p class="p"></p>
  <Div></Div>
  <Div></Div>
</Div>

component.mountTo(document.body)

console.log(component)
