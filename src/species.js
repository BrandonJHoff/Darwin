const species = ({ id, rate, lifespan, p5 }) => () => {
  const init_mutation_rate = rate
  const rockets = []
  const gen_fastest_time = Infinity
  const fastest_time = Infinity
  const finished = false
  const mutation_rate = this.init_mutation_rate
  const mutation_change = 0.97
  const perfect_score = 1
  const fitness_sum = 0
  const avg_fitness = null
  const max_fitness = 0
  const species_arrived = false

  switch (id) {
    case 0:
      this.color = p5.color(246, 193, 1, 255)
      this.name = ' - Yellow'
      break
    case 1:
      this.color = p5.color(1, 193, 246, 255)
      this.name = ' - Blue'
      break
    case 2:
      this.color = p5.color(50, 205, 50, 255)
      this.name = ' - Green'
      break
  }

  return {
    count: () => rockets.length,
    addRockets: (count) => {},
    update: (cycle) => {},
    calculate_fitness: (destination) => {},
    generate: (num_in_next_gen) => {},
    pickOne: (list) => {}
  }
}

export default species
