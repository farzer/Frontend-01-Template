import { create, Text, Wrapper } from './createElement'
import { Panel } from './Panel'

const component = <Panel title="This is title">
<span>This is Content</span>
</Panel>

component.mountTo(document.body)

console.log(component)
