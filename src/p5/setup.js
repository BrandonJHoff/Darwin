const setup = ({ p5, width, height, x, y }) => () => {
  const cnv = p5.createCanvas(width, height)
  cnv.position(x, y)
}

export default setup
