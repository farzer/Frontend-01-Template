const clsReg = /\.[_a-zA-Z][_\-0-9a-zA-Z]*/g
const idReg = /#[_a-zA-Z][_\-0-9a-zA-Z]*/g
const tagStartReg = /^([a-z]+)((\.|#).+)*$/

function contain(a: string[], b: string[]) {
  return a.every(s => b.includes(s))
}

function checkClass(element: HTMLElement, selector: string) {
  const cls = selector.match(clsReg).map(c => c.replace('.', ''))
  const currentCls = element.classList.value.split(/\s+/)
  return contain(cls, currentCls)
}

function checkId(element: HTMLElement, selector: string) {
  const ids = selector.match(idReg).map(c => c.replace('#', ''))
  const currentIds = element.id.split(/\s+/)
  return contain(ids, currentIds)
}

function checkTag(element: HTMLElement, selector: string) {
  const firstLetter = selector.charAt(0)
  const currentTagName = selector.match(tagStartReg)[1]
  if (firstLetter !== '#' && firstLetter !== '.') {
    return element.tagName === currentTagName.toUpperCase()
  }

  return true
}

function matchChildSelector(element: HTMLElement, selector: string) {
  return checkTag(element, selector) && checkClass(element, selector) && checkId(element, selector)
}
function match(selector: string, element: HTMLElement) {
  const stack = selector.split(/\s+/)
  if (stack.length === 0 || !element) {
    return false
  }

  let res = true
  let loop = true
  let currentElement = element

  let currentChildSelector = stack.pop()

  while (stack.length && loop) {
    if (currentElement === null) {
      break;
    }
    if (currentElement.parentElement === null) {
      loop = false
    }

    if (matchChildSelector(currentElement, currentChildSelector)) {
      res = true
      currentChildSelector = stack.pop()
    } else {
      res = false
    }

    currentElement = currentElement.parentElement as HTMLElement
  }

  return res
}

