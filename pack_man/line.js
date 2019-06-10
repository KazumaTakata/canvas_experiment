function drawLine(ctx, startPoint, endPoint) {
  ctx.beginPath()
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.lineWidth = 3
  ctx.strokeStyle = '#3c8bf6'
  ctx.stroke()
}

function drawRoundCorner(ctx, centerPoint, radius, element) {
  ctx.beginPath()
  let startAngle
  let endAngle

  switch (element) {
    case 'UR':
      startAngle = Math.PI * 1.5
      endAngle = 2 * Math.PI
      break
    case 'UL':
      startAngle = Math.PI * 1
      endAngle = Math.PI * 1.5
      break
    case 'DL':
      startAngle = Math.PI * 0.5
      endAngle = Math.PI * 1
      break
    case 'DR':
      startAngle = Math.PI * 0
      endAngle = Math.PI * 0.5
      break
  }
  ctx.arc(centerPoint.x, centerPoint.y, radius, startAngle, endAngle)
  ctx.stroke()
}

function drawCurvedLine(Points, radius) {
  for (let i = 0; i < Points.length - 1; i++) {
    //   draw vertical line
    if (Points[i].x == Points[i + 1].x) {
      if (Points[i].y < Points[i + 1].y) {
        drawLine(
          ctx,
          {
            x: Points[i].x,
            y: Points[i].y + radius
          },
          {
            x: Points[i + 1].x,
            y: Points[i + 1].y - radius
          }
        )

        // draw rounded corner
        if (Points[i + 2] != undefined) {
          if (Points[i + 1].x > Points[i + 2].x) {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x - radius,
                y: Points[i + 1].y - radius
              },
              radius,
              'DR'
            )
          } else {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x + radius,
                y: Points[i + 1].y - radius
              },
              radius,
              'DL'
            )
          }
        }
      } else {
        drawLine(
          ctx,
          {
            x: Points[i].x,
            y: Points[i].y - radius
          },
          {
            x: Points[i + 1].x,
            y: Points[i + 1].y + radius
          }
        )

        // draw rounded corner
        if (Points[i + 2] != undefined) {
          if (Points[i + 1].x > Points[i + 2].x) {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x - radius,
                y: Points[i + 1].y + radius
              },
              radius,
              'UR'
            )
          } else {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x + radius,
                y: Points[i + 1].y + radius
              },
              radius,
              'UL'
            )
          }
        }
      }

      //   draw horizontal line
    } else {
      if (Points[i].x < Points[i + 1].x) {
        drawLine(
          ctx,
          { x: Points[i].x + radius, y: Points[i].y },
          { x: Points[i + 1].x - radius, y: Points[i + 1].y }
        )
        if (Points[i + 2] != undefined) {
          if (Points[i + 1].y > Points[i + 2].y) {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x - radius,
                y: Points[i + 1].y - radius
              },
              radius,
              'DR'
            )
          } else {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x - radius,
                y: Points[i + 1].y + radius
              },
              radius,
              'UR'
            )
          }
        }
      } else {
        drawLine(
          ctx,
          { x: Points[i].x - radius, y: Points[i].y },
          { x: Points[i + 1].x + radius, y: Points[i + 1].y }
        )

        if (Points[i + 2] != undefined) {
          if (Points[i + 1].y > Points[i + 2].y) {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x + radius,
                y: Points[i + 1].y - radius
              },
              radius,
              'DL'
            )
          } else {
            drawRoundCorner(
              ctx,
              {
                x: Points[i + 1].x + radius,
                y: Points[i + 1].y + radius
              },
              radius,
              'UL'
            )
          }
        }
      }
      // draw rounded corner of horizontal line
    }
  }
}
