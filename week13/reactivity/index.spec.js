const { effect, reactive } = require('./index')

describe('Test reactive', () => {
  it('test effect', () => {
    let dump
    const obj = reactive({ a: 1 })
    effect(() => dump = obj.a)
    expect(dump).toBe(obj.a)
  });

  it('test multi effect', () => {
    let a, b
    const obj1 = reactive({ a: 1 })
    const obj2 = reactive({ b: 2 })
    effect(() => a = obj1.a)
    effect(() => b = obj2.b)
    expect(a).toBe(obj1.a)
    expect(b).toBe(obj2.b)
  });

  it('test nest obj', () => {
    let a
    const obj1 = reactive({ a: { b: 1} })
    effect(() => a = obj1.a.b)
    expect(a).toBe(1)
  });
});