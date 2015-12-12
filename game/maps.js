export default [{
  fieldSize: 1,
  ball: {
    pos: { x: 150, y: 150 }
  },
  teamA: {
    mode: 'attack',
    tshirt: 'blue',
    players: [{
      pos: { x: 100, y: 100},
      control: true
    }, {
      pos: { x: 200, y: 200}
    }]
  },
  teamB: {
    mode: 'defend',
    tshirt: 'red',
    players:[{
      pos: { x: 300, y: 300}
    }, {
      pos: { x: 400, y: 400}
    }]
  }
}];
