const create = () => ({
  obstacles: []
})

const add = ({ obstacles, x1, y1, x2, y2 }) => obstacles.concat([{ x1, y1, x2, y2 }])

const draw = ({ obstacles, p5 }) => {
  obstacles.forEach(({ x1, y1, x2, y2 }) => {
    p5.stroke(255)
    p5.strokeWeight(2)
    p5.line(x1, y1, x2, y2)
  })
}

const Obstacles = () => ({
  create,
  add,
  draw
})

export default Obstacles
