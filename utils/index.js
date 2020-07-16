// Utilities

const drawBezier = (ctx, start, end) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(randomX(), randomY(), randomX(), randomY(), end.x, end.y);
  ctx.strokeStyle = '#0083b9';
  ctx.stroke();
  ctx.strokeStyle = '#000';
  ctx.closePath();
}

const drawCircle = (ctx, { x, y, radius = TOWER_RADIUS }) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

const drawLine = (ctx, startX, startY, endX, endY, width = 1) => {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = "#afafaf";
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";
  ctx.closePath();
}

const drawSquare = (ctx, startX, startY, width, fill) => {
  ctx.beginPath();
  ctx.rect(startX, startY, width, width);

  ctx.lineWidth = 0.5;
  ctx.fillStyle = fill;
  ctx.fill()
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#afafaf";
  ctx.stroke();
  ctx.strokeStyle = "#000";
}

const d = number => Math.floor(Math.random() * number) + 1;

module.exports = { drawBezier, drawCircle, drawLine, drawSquare, d }