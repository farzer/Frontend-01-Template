import {add} from '../src/add'
import assert from 'assert'

describe('add', () => {
  it('add(3, 4) should be 7', () => {
    assert.equal(add(3, 4), 7)
  });
});