const images = require('images')

function render(viewport, element) {
  if (element.style) {
    const img = images(element.style.width, element.style.height)

    if (element.style['background-color']) {
      const color = element.style['background-color'] || 'rgb(0,0,0)'
      color.match(/rgb\((\d+),[ ]*(\d+),[ ]*(\d+)\)/)
      const r = Number(RegExp.$1)
      const g = Number(RegExp.$2)
      const b = Number(RegExp.$3)
      img.fill(r, g, b)
      const { left = 0, top = 0 } = element.style
      viewport.draw(img, left, top)
    }
  }
}

module.exports = render;