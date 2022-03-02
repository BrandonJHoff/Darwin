const MAX_SPEED = 3
const COLLISION_DISTANCE = 2
const STATUS = {
  ARRIVED: 'ARRIVED',
  FLED: 'FLED',
  FLYING: 'FLYING',
  CRASHED: 'CRASHED'
}

// ########################################################################################
// ──── CREATE ────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const createPlane = ({ p5 }) => ({
  pos: p5.createVector(25, p5.height / 2),
  vel: p5.createVector(),
  acc: p5.createVector(),
  color: p5.color('lime'),
  status: STATUS.FLYING,
  cycleArrived: null,
  fitness: 0,
  isFirst: false
})

const create = ({ DNA }) => ({ lifespan, p5 }) => {
  return ({
    ...createPlane({ p5 }),
    dna: DNA.create({ lifespan, p5 })
  })
}

const createWithDna = ({ p5, dna }) => {
  return ({
    ...createPlane({ p5 }),
    dna
  })
}

// ########################################################################################
// ──── UPDATE ────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const update = ({ plane, cycle, lifespan, destination, obstacles, p5 }) => {
  if (plane.status !== STATUS.FLYING) {
    return plane
  }

  const absDist = Math.abs(p5.dist(plane.pos.x, plane.pos.y, destination.x, destination.y))

  // has arrived
  if (absDist < 6) {
    return {
      ...plane,
      status: STATUS.ARRIVED,
      cycleArrived: cycle,
      fitness: Math.pow((lifespan / cycle), 20) * 100
    }
  }

  // has fled
  if (plane.pos.x < 0 || plane.pos.x > p5.width || plane.pos.y < 0 || plane.pos.y > p5.height) {
    return {
      ...plane,
      status: STATUS.FLED,
      color: p5.color('Fuchsia'),
      fitness: plane.fitness * 0.3
    }
  }

  // has crashed
  if (hasIntersectedObstacles({ plane, obstacles, p5 })) {
    return {
      ...plane,
      status: STATUS.CRASHED,
      color: p5.color('red'),
      fitness: plane.fitness * 0.25
    }
  }

  // update position
  const newAcc = plane.acc.add(plane.dna.genes[cycle])
  const newVel = plane.vel.add(newAcc).limit(MAX_SPEED)

  return {
    ...plane,
    vel: newVel,
    pos: plane.pos.add(newVel),
    acc: newAcc.mult(0),
    fitness: Math.max(plane.fitness, Math.pow((lifespan - (absDist + (cycle / lifespan))) / lifespan, 3))
  }
}

// ########################################################################################
// ──── HAS INTERSECTED OBSTACLE ──────────────────────────────────────────────────────────
// ########################################################################################
const hasIntersectedObstacles = ({ plane, obstacles, p5 }) =>
  obstacles.reduce((acc, obstacle) =>
    acc || calcDistanceToLineSegment({ plane, obstacle, p5 }) < COLLISION_DISTANCE
  , false)

const calcDistanceToLineSegment = ({ plane, obstacle, p5 }) => {
  const distA = p5.dist(plane.pos.x, plane.pos.y, obstacle.x1, obstacle.y1)
  const distB = p5.dist(plane.pos.x, plane.pos.y, obstacle.x2, obstacle.y2)
  const distC = p5.dist(obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2)

  if (p5.sq(distB) > (p5.sq(distA) + p5.sq(distC))) {
    return distA
  } else if (p5.sq(distA) > (p5.sq(distB) + p5.sq(distC))) {
    return distB
  } else {
    const s = (distA + distB + distC) / 2
    return ((2 / distC) * p5.sqrt(s * (s - distA) * (s - distB) * (s - distC)))
  }
}

// ########################################################################################
// ──── DRAW ──────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const draw = ({ plane, p5 }) => {
  p5.strokeWeight(plane.isFirst ? 3 : 1)
  p5.stroke(plane.color)
  if (!plane.isFirst) p5.noFill() // It is more performant without filling

  const r = 3
  const angle = plane.vel.heading()
  const anglePlus = 2.5
  p5.triangle(
    plane.pos.x + Math.cos(angle) * r, plane.pos.y + Math.sin(angle) * r,
    plane.pos.x + Math.cos(angle + anglePlus) * r, plane.pos.y + Math.sin(angle + anglePlus) * r,
    plane.pos.x + Math.cos(angle - anglePlus) * r, plane.pos.y + Math.sin(angle - anglePlus) * r
  )
}

// ########################################################################################
// ──── BREED ─────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const breed = ({ DNA }) => ({ planeA, planeB, p5 }) => {
  return createWithDna({ dna: DNA.breed({ dna1: planeA.dna, dna2: planeB.dna, p5 }), p5 })
}

// ########################################################################################
// ──── FINISHED ──────────────────────────────────────────────────────────────────────────
// ########################################################################################
const finished = ({ plane }) => plane.status !== STATUS.FLYING
const hasArrived = ({ plane }) => plane.status === STATUS.ARRIVED

// ########################################################################################
// ──── RESET ─────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const reset = ({ plane, p5 }) => {
  return {
    ...plane,
    pos: p5.createVector(25, p5.height / 2),
    vel: p5.createVector(),
    acc: p5.createVector(),
    color: p5.color('magenta'),
    status: STATUS.FLYING,
    fitness: 0
  }
}

// ########################################################################################
// ──── PLANE ─────────────────────────────────────────────────────────────────────────────
// ########################################################################################
const Plane = ({ DNA }) => ({
  create: create({ DNA }),
  update,
  draw,
  breed: breed({ DNA }),
  finished,
  reset,
  hasArrived
})

export default Plane
