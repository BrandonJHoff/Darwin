// ########################################################################################
// ──── SETUP ─────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const setup = ({ Population, p5, width, height, x, y, state }) => () => {
  const cnv = p5.createCanvas(width, height)
  cnv.position(x, y)

  state.population = Population.create({ lifespan: Math.floor(width), numIndividuals: 200, p5 })
  state.destination = p5.createVector(width - 25, height / 2)
  state.obstacles = []
  state.mouse = { x: null, y: null }
}

// ########################################################################################
// ──── DRAW ──────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const draw = ({ Population, p5, width, height, x, y, state }) => () => {
  p5.background(44, 62, 80)
  p5.noStroke()
  p5.fill(255)

  state.population = Population.update({ ...state, p5 })

  if (state.population.anyArrived) {
    p5.stroke(255)
    p5.fill('lime')
  }
  p5.ellipse(state.destination.x, state.destination.y, 12, 12)
  p5.noStroke()
  p5.fill(255)

  p5.text(`Time: ${state.population.cycle} -- Time Left: ${state.population.lifespan - state.population.cycle}`, 10, height - 50)
  p5.text(`Generation: ${state.population.generation}`, 10, height - 30)
  if (state.population.bestOverallTime !== Infinity) p5.text(`Overall Best: ${state.population.bestOverallTime}`, 10, height - 10)

  Population.draw({ ...state, p5 })

  state.obstacles.forEach(({ x1, y1, x2, y2 }) => {
    p5.stroke(255)
    p5.strokeWeight(2)
    p5.line(x1, y1, x2, y2)
  })

  if (state.mouse.x) {
    p5.stroke(255)
    p5.strokeWeight(5)
    p5.line(state.mouse.x, state.mouse.y, p5.mouseX, p5.mouseY)
  }

  if (state.population.allFinished) {
    state.population = Population.evolve({ ...state, p5 })
  }
}

// ########################################################################################
// ──── RUN ───────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const run = ({ P5, createFn }) => () => {
  return new P5(createFn)
}

// ########################################################################################
// ──── CREATE ────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const create = ({ state, Population }) => p5 => {
  const width = p5.windowWidth * 0.75
  const height = p5.windowHeight * 0.75
  const x = (p5.windowWidth - width) / 2
  const y = (p5.windowHeight - height) / 2

  p5.setup = setup({ Population, p5, width, height, x, y, state })

  p5.draw = draw({ Population, p5, width, height, x, y, state })

  p5.mousePressed = () => {
    if (p5.mouseX > 0 && p5.mouseX < width && p5.mouseY > 0 && p5.mouseY < height) {
      if (!state.mouse.x) {
        state.mouse = { x: p5.mouseX, y: p5.mouseY }
      } else {
        state.obstacles = state.obstacles.concat({ x1: state.mouse.x, y1: state.mouse.y, x2: p5.mouseX, y2: p5.mouseY })
        state.mouse = { x: null, y: null }
      }
    } else {
      state.mouse = { x: null, y: null }
    }

    // prevent default
    return false
  }
}

// ########################################################################################
// ──── WORLD ─────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const World = ({ P5, Population }) => {
  const state = {}
  return {
    run: run({ P5, createFn: create({ state, Population }) })
  }
}

export default World
