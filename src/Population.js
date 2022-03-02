// ########################################################################################
// ──── CREATE ────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const create = ({ Plane }) => ({ lifespan, numIndividuals, p5 }) => {
  return {
    lifespan,
    maxPlanes: numIndividuals,
    planes: Array(numIndividuals).fill(0).map((_, i) => Plane.create({ lifespan, p5 })),
    generation: 0,
    bestOverallTime: Infinity,
    bestOverallName: '',
    bestGenTime: Infinity,
    cycle: 0,
    allFinished: false
  }
}

// ########################################################################################
// ──── UPDATE ────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const update = ({ Plane }) => ({ population, p5, destination, obstacles }) => {
  if (population.cycle >= population.lifespan) {
    return {
      ...population,
      allFinished: true
    }
  }

  const planes = population.planes.map(plane => Plane.update({ plane, cycle: population.cycle, lifespan: population.lifespan, destination, obstacles, p5 }))
  const allFinished = planes.every(plane => Plane.finished({ plane }))

  return {
    ...population,
    planes,
    allFinished,
    cycle: population.cycle + 1
  }
}

// ########################################################################################
// ──── DRAW ──────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const draw = ({ Plane }) => ({ population, p5 }) => {
  population.planes.forEach(plane => Plane.draw({ plane, p5 }))
}

// ########################################################################################
// ──── EVOLVE ────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const evolve = ({ Plane }) => ({ population, destination, p5 }) => {
  return {
    ...population,
    generation: population.generation + 1,
    cycle: 0,
    planes: generateNextGeneration({ Plane, population, p5 }),
    allFinished: false,
    bestOverallTime: population.planes.reduce((acc, plane) => plane.cycleArrived ? Math.min(acc, plane.cycleArrived) : acc, population.bestOverallTime)
  }
}

const generateNextGeneration = ({ Plane, population, p5 }) => {
  const sortedPlanes = population.planes.sort((a, b) => b.fitness - a.fitness)
  const newPlanes = [{ ...Plane.reset({ plane: sortedPlanes[0], p5 }), color: p5.color('yellow') }]

  return newPlanes.concat(Array(population.maxPlanes - 1).fill(0).map(() => {
    const planeA = pickOne({ planes: population.planes, p5, population })
    const planeB = pickOne({ planes: population.planes.filter(p => p !== planeA), p5, population })

    return Plane.breed({ planeA, planeB, p5 })
  }))
}

const pickOne = ({ planes, p5, population }) => {
  const sumFitness = planes.reduce((sum, plane) => sum + plane.fitness, 0)

  return planes.reduce((acc, plane) => {
    if (acc.plane) return acc

    if (acc.target < plane.fitness) {
      return { ...acc, plane: plane }
    }

    return { ...acc, target: acc.target - plane.fitness }
  }, { plane: null, target: p5.random(0, sumFitness) }).plane
}

// ########################################################################################
// ──── POPULATION ────────────────────────────────────────────────────────────────────────
// ########################################################################################
const Population = ({ Plane }) => {
  return {
    create: create({ Plane }),
    update: update({ Plane }),
    draw: draw({ Plane }),
    evolve: evolve({ Plane })
  }
}

export default Population
