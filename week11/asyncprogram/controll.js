function switchLight(type) {
  const lights = document.getElementsByTagName('div')
  for (let index = 0; index < lights.length; index++) {
    const light = lights[index];
    light.classList.remove('light')
    document.getElementsByClassName(type)[0].classList.add('light')
  }
}

function green() {
  switchLight('green')
}

function red() {
  switchLight('red')
}

function yellow() {
  switchLight('yellow')
}