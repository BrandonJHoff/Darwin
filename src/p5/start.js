
const start = ({ P5, setup, draw }) => {
  const sketch = p => {
    const width = p.windowWidth * 0.75
    const height = p.windowHeight * 0.75
    const x = (p.windowWidth - width) / 2
    const y = (p.windowHeight - height) / 2

    const destination = p.createVector(width - 25, height / 2)

    p.setup = setup({ p, width, height, x, y })

    p.draw = draw({ p, x, y, destination })
  }

  return new P5(sketch)
}

export default start
