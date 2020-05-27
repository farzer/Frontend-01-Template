const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')
const path = require('path')

// https://w3.org/TR/?tag=css
function getStandards() {
  const list = document.getElementById('container').children

  const result = []
  for (const li of list) {
    if (li.getAttribute('data-tag').match(/css/)) {
      const title = li.children[1].innerText
      result.push({
        name: title,
        url: li.children[1].children[0].href
      })
    }
  }

  return result
}

void async function() {
  https.get('https://www.w3.org/TR/\?tag\=css', res => {
    const { statusCode } = res;
    if (statusCode === 200) {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })
      res.on('end', () => {
        const result = []
        const $ = cheerio.load(rawData)
        const list = $('#container li').each((key, li) => {
          const dataTag = (li && li.attribs && li.attribs['data-tag']) || ''
          const valid = dataTag.match(/css/)
          if (valid) {
            const title = li.children[3].children[0].children[0].data
            const href = li.children[3].children[0]['attribs'].href
            result.push({
              name: title,
              url: href
            })
          }
        })
        const content = JSON.stringify(result, null, 2)
        const filename = ['standard', new Date().toISOString().slice(0,10), '.json'].join('')
        
        const dirFile = path.join(__dirname, filename)
        fs.writeFile(dirFile, content, err => {
          if (err) {
            throw err
          }

          console.log('文件创建成功')
        })
      })
    }
  })
}()