function create(Cls, attributes, ...children) {
  let o = new Cls({
    timer: {}
  });

  for (let name in attributes){
    o.setAttribute(name, attributes[name])
  }
  for (let child of children) {
    o.appendChild(child)
  }
  return o;
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
  <Div></Div>
  <Div></Div>
  <Div></Div>
</Div>

component.mountTo(document.body)

console.log(component)
