var dimension = [
  document.documentElement.clientWidth,
  document.documentElement.clientHeight
]
var c = document.getElementById('mycanvas')
c.width = dimension[0]
c.height = dimension[1]

var ctx = c.getContext('2d')

let Points = [
  { x: 0, y: 0 },
  { x: 0, y: 3 },
  { x: 2, y: 3 },
  { x: 2, y: 4 },
  { x: 0, y: 4 },
  { x: 0, y: 7 },
  { x: 15, y: 7 },
  { x: 15, y: 4 },
  { x: 13, y: 4 },
  { x: 13, y: 3 },
  { x: 15, y: 3 },
  { x: 15, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 2 }
]

let blockSize = 50
let initPoint = { x: 50, y: 50 }

for (let i = 0; i < Points.length; i++) {
  Points[i].x = Points[i].x * blockSize + initPoint.x
  Points[i].y = Points[i].y * blockSize + initPoint.y
}

// drawCurvedLine(Points, 5)

let nodes = {}

addNode('node1', { x: 75, y: 75 })
addNode('node2', { x: 450, y: 75 })
addNode('node3', { x: 75, y: 175 })
addNode('node4', { x: 175, y: 175 })
addNode('node5', { x: 600, y: 75 })
addNode('node6', { x: 450, y: 375 })

connectNode('node1', 'node2', 'row', 'ArrowRight')
connectNode('node1', 'node3', 'col', 'ArrowDown')
connectNode('node3', 'node4', 'row', 'ArrowRight')
connectNode('node2', 'node5', 'row', 'ArrowRight')
connectNode('node2', 'node6', 'col', 'ArrowDown')

setNext('node1', 'node2', 'node5')

let circleProp = {
  position: {
    x: nodes['node1'].position.x,
    y: nodes['node1'].position.y
  },
  velocity: { x: 0, y: 0 },
  line: { s: 'node1', t: 'node2' },
  stopped: true,
  landingNode: 'node1'
}

let enemyProp = {
  position: {
    x: nodes['node1'].position.x,
    y: nodes['node1'].position.y
  },
  velocity: { x: 1, y: 0 },
  line: { s: 'node1', t: 'node2' },
  stopped: false,
  landingNode: 'node1'
}

function addNode(nodeName, position) {
  nodes[nodeName] = { position: position, conn: {} }
}

function ReverseDirection(direction) {
  switch (direction) {
    case 'ArrowLeft':
      return 'ArrowRight'
    case 'ArrowRight':
      return 'ArrowLeft'
    case 'ArrowUp':
      return 'ArrowDown'
    case 'ArrowDown':
      return 'ArrowUp'
  }
}

function connectNode(node1, node2, kind, direction) {
  nodes[node1].conn[node2] = {
    kind: kind,
    next: undefined,
    direction: direction
  }
  nodes[node2].conn[node1] = {
    kind: kind,
    next: undefined,
    direction: ReverseDirection(direction)
  }
}

function setNext(node1, node2, node3) {
  nodes[node1].conn[node2].next = node3
  nodes[node3].conn[node2].next = node1
}

function swapST(circleProp) {
  let tmp = circleProp.line.s
  circleProp.line.s = circleProp.line.t
  circleProp.line.t = tmp
}

window.addEventListener('keydown', function(event) {
  const key = event.key // "a", "1", "Shift", etc.

  let restriction = nodes[circleProp.line.s].conn[circleProp.line.t].kind
  if (circleProp.stopped) {
    circleProp.stopped = false
    let landingNode = circleProp.landingNode
    let direction
    if (key == 'ArrowLeft' || key == 'ArrowRight') {
      direction = 'row'
    } else {
      direction = 'col'
    }
    for (let node in nodes[landingNode].conn) {
      if (nodes[landingNode].conn[node].kind == direction) {
        if (nodes[landingNode].conn[node].direction == key) {
          circleProp.line.s = landingNode
          circleProp.line.t = node
          restriction = direction
        }
      }
    }
  }

  switch (key) {
    case 'ArrowLeft':
      if (restriction == 'row') {
        if (circleProp.velocity.x == 5) {
          swapST(circleProp)
        }
        circleProp.velocity.x = -5
        circleProp.velocity.y = 0
        circleProp.nextMove = undefined
      } else {
        circleProp.nextMove = 'ArrowLeft'
      }

      break
    case 'ArrowRight':
      if (restriction == 'row') {
        if (circleProp.velocity.x == -5) {
          swapST(circleProp)
        }
        circleProp.velocity.x = 5
        circleProp.velocity.y = 0
        circleProp.nextMove = undefined
      } else {
        circleProp.nextMove = 'ArrowRight'
      }
      break
    case 'ArrowUp':
      if (restriction == 'col') {
        if (circleProp.velocity.y == 5) {
          swapST(circleProp)
        }
        circleProp.velocity.x = 0
        circleProp.velocity.y = -5
        circleProp.nextMove = undefined
      } else {
        circleProp.nextMove = 'ArrowUp'
      }
      break
    case 'ArrowDown':
      if (restriction == 'col') {
        if (circleProp.velocity.y == -5) {
          swapST(circleProp)
        }
        circleProp.velocity.x = 0
        circleProp.velocity.y = 5
        circleProp.nextMove = undefined
      } else {
        circleProp.nextMove = 'ArrowDown'
      }
      break
  }
})

function getMax(nodes, circleProp, x_or_y) {
  let max_value
  let min_value
  if (
    nodes[circleProp.line.s].position[x_or_y] >
    nodes[circleProp.line.t].position[x_or_y]
  ) {
    max_value = {
      value: nodes[circleProp.line.s].position[x_or_y],
      id: circleProp.line.s
    }
    min_value = {
      value: nodes[circleProp.line.t].position[x_or_y],
      id: circleProp.line.t
    }
  } else {
    max_value = {
      value: nodes[circleProp.line.t].position[x_or_y],
      id: circleProp.line.t
    }
    min_value = {
      value: nodes[circleProp.line.s].position[x_or_y],
      id: circleProp.line.s
    }
  }
  return [max_value, min_value]
}

function circleMoveInOutrange(nodes, circleProp, x_or_y, min_value, max_value) {
  let nextMoveFlag = true
  for (let node in nodes[circleProp.line.t].conn) {
    if (
      nodes[circleProp.line.t].conn[node].direction == circleProp.nextMove &&
      circleProp.nextMove != undefined
    ) {
      nextMoveFlag = false
      circleProp.line.s = circleProp.line.t
      circleProp.line.t = node

      switch (circleProp.nextMove) {
        case 'ArrowLeft':
          calibratePosition(circleProp, 'y', min_value, max_value)
          circleProp.velocity.x = -5
          circleProp.velocity.y = 0
          circleProp.nextMove = undefined

          break
        case 'ArrowRight':
          calibratePosition(circleProp, 'y', min_value, max_value)
          circleProp.velocity.x = 5
          circleProp.velocity.y = 0
          circleProp.nextMove = undefined

          break
        case 'ArrowUp':
          calibratePosition(circleProp, 'x', min_value, max_value)
          circleProp.velocity.x = 0
          circleProp.velocity.y = -5
          circleProp.nextMove = undefined

          break
        case 'ArrowDown':
          calibratePosition(circleProp, 'x', min_value, max_value)
          circleProp.velocity.x = 0
          circleProp.velocity.y = 5
          circleProp.nextMove = undefined

          break
      }

      break
    }
  }

  if (nextMoveFlag) {
    let next = nodes[circleProp.line.s].conn[circleProp.line.t].next
    if (next != undefined) {
      circleProp.line.s = circleProp.line.t
      circleProp.line.t = next
    } else {
      nodeArrive(circleProp, x_or_y, min_value, max_value)
      // calibratePosition(circleProp, x_or_y, min_value, max_value)
      // circleProp.velocity.x = 0
      // circleProp.velocity.y = 0
      // circleProp.stopped = true
      // circleProp.nextMove = undefined
    }
  }
}

function nodeArrive(circleProp, x_or_y, min_value, max_value) {
  calibratePosition(circleProp, x_or_y, min_value, max_value)
  circleProp.velocity.x = 0
  circleProp.velocity.y = 0
  circleProp.stopped = true
  circleProp.nextMove = undefined
}

function calibratePosition(circleProp, x_or_y, min_value, max_value) {
  if (circleProp.position[x_or_y] < min_value.value) {
    circleProp.position[x_or_y] = min_value.value
    circleProp.landingNode = min_value.id
  } else {
    circleProp.position[x_or_y] = max_value.value
    circleProp.landingNode = max_value.id
  }
}

function drawCircle(nodes, circleProp, x_or_y) {
  let max_min = getMax(nodes, circleProp, x_or_y)
  let max_value = max_min[0]
  let min_value = max_min[1]

  if (
    circleProp.position[x_or_y] >= min_value.value &&
    circleProp.position[x_or_y] <= max_value.value
  ) {
    circleProp.position.x += circleProp.velocity.x
    circleProp.position.y += circleProp.velocity.y
  } else {
    circleMoveInOutrange(nodes, circleProp, x_or_y, min_value, max_value)
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function drawEnemyCircle(nodes, circleProp, x_or_y) {
  if (circleProp.stopped) {
    circleProp.stopped = false
    let connectedNodes = Object.keys(nodes[circleProp.landingNode].conn)
    // choose next node randomly.
    let index = getRandomInt(connectedNodes.length)
    let node = connectedNodes[index]
    let direction = nodes[circleProp.landingNode].conn[node].direction
    circleProp.line.s = circleProp.landingNode
    circleProp.line.t = node

    switch (direction) {
      case 'ArrowLeft':
        circleProp.velocity.x = -5
        circleProp.velocity.y = 0

        break
      case 'ArrowRight':
        circleProp.velocity.x = 5
        circleProp.velocity.y = 0

        break
      case 'ArrowUp':
        circleProp.velocity.x = 0
        circleProp.velocity.y = -5

        break
      case 'ArrowDown':
        circleProp.velocity.x = 0
        circleProp.velocity.y = 5

        break
    }
  }

  let max_min = getMax(nodes, circleProp, x_or_y)
  let max_value = max_min[0]
  let min_value = max_min[1]

  if (
    circleProp.position[x_or_y] >= min_value.value &&
    circleProp.position[x_or_y] <= max_value.value
  ) {
    circleProp.position.x += circleProp.velocity.x
    circleProp.position.y += circleProp.velocity.y
  } else {
    nodeArrive(circleProp, x_or_y, min_value, max_value)
  }
}

function Draw() {
  ctx.clearRect(0, 0, dimension[0], dimension[1])

  drawCurvedLine(Points, 5)

  if (circleProp.velocity.y == 0) {
    drawCircle(nodes, circleProp, 'x')
  } else {
    drawCircle(nodes, circleProp, 'y')
  }
  ctx.beginPath()
  ctx.arc(circleProp.position.x, circleProp.position.y, 20, 0, 2 * Math.PI)
  ctx.stroke()

  // draw enemy
  // if (enemyProp.velocity.y == 0) {
  //   drawEnemyCircle(nodes, enemyProp, 'x')
  // } else {
  //   drawEnemyCircle(nodes, enemyProp, 'y')
  // }

  // ctx.beginPath()
  // ctx.arc(enemyProp.position.x, enemyProp.position.y, 20, 0, 2 * Math.PI)
  // ctx.stroke()

  window.requestAnimationFrame(Draw)
}

window.requestAnimationFrame(Draw)
