const cycle = 300
const lifespan = 1200

const absDist = 500 + ((cycle * 500) / lifespan)
const minDist = 500

const temp = Math.pow((lifespan / cycle), 6) * 100

const temp2 = Math.pow((lifespan - 300) / lifespan, 3)

const temp3 = Math.min(absDist, minDist)

console.log({ temp, temp2, temp3, absDist })
