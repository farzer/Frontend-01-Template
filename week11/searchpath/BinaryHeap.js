class BinaryHeap {
  constructor(data, compare) {
    this.data = data
    this.compare = compare
  }

  get length() {
    return this.data.length
  }

  take() {
    if (!this.data.length) {
      return
    }
    let min = this.data[0]
    let i = 0
    while (i < this.data.length) {
      if (i * 2 + 1 >= this.data.length) {
        break
      }
      if (i * 2 + 2 >= this.data.length) {
        i = i * 2 + 1
        break
      }
      if (this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0) {
        this.data[i] = this.data[i * 2 + 1]
        i = i * 2 + 1
      }
    }
  }
}