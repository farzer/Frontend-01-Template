import { create, Text, Wrapper } from './createElement'
import { ListView } from './ListView'

let data= [
  { title: 'lan', url: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg"},
  { title: 'white', url: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"}
]

const component = <ListView data={data}>
{record => (
  <figure>
    <img src={record.url} />
    <figcaption>{record.title}</figcaption>
  </figure>
)}
</ListView>

component.mountTo(document.body)

console.log(component)
