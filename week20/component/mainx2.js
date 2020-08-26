import { create, Text, Wrapper } from './createElement'
import { TabPanel } from './TabPanel'

const component = <TabPanel title="This is title">
<span title="title1">This is Content1</span>
<span title="title2">This is Content2</span>
<span title="title3">This is Content3</span>
<span title="title4">This is Content4</span>
</TabPanel>

component.mountTo(document.body)

console.log(component)
