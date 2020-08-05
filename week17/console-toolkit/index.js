const tty = require('tty')
const ttys = require('ttys')
const rl = require('readline')

const stdin = ttys.stdin
const stdout = ttys.stdout
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf-8')

function getChar() {
  return new Promise((resolve) => {
    stdin.once('data', key => {
      resolve(key)
    })
  })
}

function up(n = 1) {
  stdout.write('\033[' + n + 'A')
}

function down(n = 1) {
  stdout.write('\033[' + n + 'B')
}

function forward(n = 1) {
  stdout.write('\033[' + n + 'C')
}

function backward(n = 1) {
  stdout.write('\033[' + n + 'D')
}

async function select(choices) {
  let selected = 0
  for (let i = 0; i < choices.length; i++) {
    if (i === selected) {
      stdout.write("[x] " + choices[i] + '\n')
      continue
    }
    stdout.write("[ ] " + choices[i] + '\n')
  }
  up(choices.length)
  forward()

  while (true) {
    let char = await getChar()

    if (char === '\u0003') {
      process.exit();
      break
    }

    if (char === 'w' && selected > 0) {
      stdout.write(' ')
      backward()
      selected--;
      up();
      stdout.write('x')
      backward()
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ')
      backward()
      selected++;
      down();
      stdout.write('x')
      backward()
    }
    if (char === '\r') {
      down(choices.length - selected)
      backward()
      return choices[selected]
    }
  }
}

void async function () {
  const answer = await select(['vue', 'react', 'angular'])
  stdout.write('You selected ' + answer + '!\n')
  process.exit()
}()