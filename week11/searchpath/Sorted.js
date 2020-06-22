class Sorted {
  constructor(data, compare) {
    this.data = data
    this.compare = compare
  }

  take() {
    let min = this.data[0]
    let minIndex = 0
    for (let index = 1; index < this.data.length; index++) {
      if (this.compare(this.data[index], min) < 0) {
        minIndex = index
        min = this.data[index]
      }
    }
    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()
    return min
  }

  insert(v) {
    this.data.push(v)
  }

  get length() {
    return this.data.length
  }
}