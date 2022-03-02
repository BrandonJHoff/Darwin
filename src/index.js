import { createContainer, asFunction, asValue } from 'awilix'
import P5 from './p5/p5.min'
import DNA from './DNA'
import Plane from './Plane'
import Population from './Population'
import World from './World'

const container = createContainer().register({
  P5: asValue(P5),

  DNA: asFunction(DNA),
  Plane: asFunction(Plane),
  Population: asFunction(Population),
  World: asFunction(World)
})

container.cradle.World.run()
