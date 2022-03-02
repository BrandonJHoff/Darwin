const draw = ({ population }) => ({ p5, width, height, x, y, destination }) => () => {
  p5.background(44, 62, 80)

  const cycle = population.update()

  p5.noStroke()
  p5.fill(255)

  if (population.first_arrived_color) {
    p5.stroke(255)
    p5.fill(population.first_arrived_color)
  }

  p5.ellipse(destination.x, destination.y, 12, 12)
  p5.noStroke()
  p5.fill(255)

  p5.text(`Step: ${population.lifespan - cycle}`, 10, height - 50)
  p5.text(`Generation: ${population.generation}`, 10, height - 30)

  if (population.gen_best_time !== Infinity) p5.text(`Best: ${population.gen_best_time}`, 105, height - 30)
  if (population.best_time !== Infinity) p5.text(`Overall Best: ${population.best_time}${population.best_name}`, 10, height - 10)

  p5.text(`Yellow: ${population.species[0].count} Blue: ${population.species[1].count} Green: ${population.species[2].count}`, width - 200, height - 10)

  //   for (let i = 0; i < obstacles.length; i++) {
  //     stroke(255)
  //     strokeWeight(2)
  //     line(obstacles[i].x1, obstacles[i].y1, obstacles[i].x2, obstacles[i].y2)
  //   }

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

export default draw
