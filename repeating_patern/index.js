var dimension = [
  document.documentElement.clientWidth,
  document.documentElement.clientHeight
]
var c = document.getElementById('mycanvas')
c.width = dimension[0]
c.height = dimension[1]

var ctx = c.getContext('2d')
ctx.beginPath()

let initX = -100
let initY = 0
let lineWidth = 1
let patternHeight = 50
let patternWidth = 50

ctx.lineWidth = lineWidth
let color = 150
let color2 = 40
let color3 = 160
for (let i = 0; i < 50; i++) {
  for (let j = 0; j < 20; j++) {
    let region = new Path2D()
    region.moveTo(initX + patternWidth * i, initY + patternHeight * j)
    region.lineTo(
      initX + patternWidth * (i + 1),
      initY + patternHeight * (j + 1)
    )
    region.lineTo(
      initX + patternWidth * (i + 2),
      initY + patternHeight * (j + 1)
    )
    region.lineTo(initX + patternWidth * (i + 1), initY + patternHeight * j)
    region.closePath()
    ctx.stroke(region)

    ctx.fillStyle = `rgb(${color + 1 * (j + 1) * (i + 1)}, ${color2 +
      1 * (j + 1) * (i + 1)}, ${color3 + 1 * (j + 1) * (i + 1)})`

    if (i % 2 == 0) {
      ctx.fillStyle = `rgb(150,10,150)`
    } else {
      ctx.fillStyle = `rgb(25,155,155)`
    }
    ctx.fill(region)
  }
}
