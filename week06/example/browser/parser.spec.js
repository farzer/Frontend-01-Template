const parser = require('./parser')

describe('Browser Parser', () => {
  test('should be an object', () => {
    const result = parser.parseHTML(`<html></html>`)
    expect(typeof result).toEqual('object')
  });

  test('should be a document type', () => {
    const result = parser.parseHTML(`<html></html>`)
    expect(result.type).toEqual('document')
  });

  test('should children be an Array', () => {
    const result = parser.parseHTML(`<html></html>`)
    expect(Object.prototype.toString.call(result.children)).toEqual('[object Array]')
  });

  test('should children not a empty array', () => {
    const result = parser.parseHTML(`<html></html>`)
    expect(result.children.length).toBeGreaterThan(0)
  });

  test('should children has one element', () => {
    const result = parser.parseHTML(`<html></html>`)
    expect(result.children.length).toEqual(1)
  });
});