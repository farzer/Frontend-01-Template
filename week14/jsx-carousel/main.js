import { create, Text, Wrapper } from './createElement'

class Carousel {
  constructor(config){
    this.children = [];
    this.current = 0
    this.attributes = new Map()
    this.properties = new Map()
  }
  set class(v) { // propery
    console.log("Div::class ", v)
  }

  setAttribute(name, val) {
    this[name] = val
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    let children = this.data.map(url => {
      let element = <img src={url}/>
      element.addEventListener('dragstart', e => e.preventDefault())
      return element
    })
    let root = <div class="carousel">
      {children}
    </div>

    const next = () => {
      const nextPosition = (this.current + 1) % this.data.length;
      const currentNode = children[this.current]
      const nextNode = children[nextPosition]
  
      currentNode.style.transition = 'ease 0s'
      nextNode.style.transition = 'ease 0s';
      currentNode.style.transform = `translateX(${-100 * this.current}%)`
      nextNode.style.transform = `translateX(${100 - 100 * nextPosition}%)`
      setTimeout(() => {
        currentNode.style.transition = ''
        nextNode.style.transition = '';
        currentNode.style.transform = `translateX(${-100 - 100* this.current}%)`
        nextNode.style.transform = `translateX(${-100 * nextPosition}%)`
  
        this.current = nextPosition
      }, 16);

      setTimeout(next, 3000);
    }
  
    setTimeout(next, 3000);
    return root
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}

let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />

component.mountTo(document.body)

console.log(component)
