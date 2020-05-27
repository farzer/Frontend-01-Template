const images = require('images')

function render(viewport, element) {
  if (element.style) {
    const img = images(element.style.width, element.style.height)

    if (element.style['background-color']) {
      const color = element.style['background-color'] || 'rgb(0,0,0)'
      color.match(/rgb\((\d+),[ ]*(\d+),[ ]*(\d+)\)/)
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
      viewport.draw(img, element.style.left || 0, element.style.right || 0, element.style.top, element.style.bottom)
    }
  }

  if (element.children) {
    for (const child of element.children) {
      render(viewport, child)
    }
  }
}