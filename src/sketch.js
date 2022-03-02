const setup = ({ p, width, height, x, y }) => () => {
  const cnv = p.createCanvas(width, height)
  cnv.position(x, y)
}

const draw = ({ p, x, y }) => () => {
  background(44, 62, 80)
  const cycle = population.update()
  noStroke()
  fill(255)
  if (population.first_arrived_color) {
    stroke(255)
    fill(population.first_arrived_color)
  }
  ellipse(destination.x, destination.y, 12, 12)
  noStroke()
  fill(255)
  text(`Step: ${population.lifespan - cycle}`, 10, height - 50)
  text(`Generation: ${population.generation}`, 10, height - 30)
  if (population.gen_best_time !== Infinity) text(`Best: ${population.gen_best_time}`, 105, height - 30)
  if (population.best_time !== Infinity) text(`Overall Best: ${population.best_time}${population.best_name}`, 10, height - 10)

  text(`Yellow: ${population.species[0].count} Blue: ${population.species[1].count} Green: ${population.species[2].count}`, width - 200, height - 10)
  for (let i = 0; i < obstacles.length; i++) {
    stroke(255)
    strokeWeight(2)
    line(obstacles[i].x1, obstacles[i].y1, obstacles[i].x2, obstacles[i].y2)
  }
  if (!cycle) {
    const gft = population.gen_fastest_time
    population.evolve(destination)
  }

  if (x1) {
    stroke(255)
    strokeWeight(5)
    line(x1, y1, mouseX, mouseY)
  }
}

const sketch = p => {
  const width = p.windowWidth * 0.75
  const height = p.windowHeight * 0.75
  const x = (p.windowWidth - width) / 2
  const y = (p.windowHeight - height) / 2

  p.setup = setup({ p, width, height, x, y })

  p.draw = draw({ p, x, y })
}

export default sketch
