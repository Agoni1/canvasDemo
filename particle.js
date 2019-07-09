class Particle {
  constructor(domOrSelector, option = {}) {
    if (domOrSelector instanceof HTMLCanvasElement) {
      this.canvas = domOrSelector;
    } else if (typeof domOrSelector === 'string') {
      this.canvas = document.querySelector(domOrSelector);
    }
    if (!this.canvas) {
      throw new Error('NOT FOUND CANVAS');
    }
    this.init();
    this.setOption(option);
  }

  init() {
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = this.canvas.clientWidth || 500;
    this.height = this.canvas.height = this.canvas.clientHeight || 500;
    this.option = {
      particleDensity: 4,
      particleSize: 2,
      particleColor: '#ff000099',
      particleSpeed: 3,
      lineWidth: 1,
      lineColor: '#ff0000',
      lineMaxLength: 60
    }
  }

  setOption(option) {
    this.option = {
      ...this.option,
      ...option
    };
    this.points = this.createPoints();
  }

  createPoints() {
    let points = [];
    let count = this.option.particleDensity * this.width * this.height / 10000;
    for (let index = 0; index < count; index++) {
      // 随机位置
      let x = Math.floor(Math.random() * this.width);
      let y = Math.floor(Math.random() * this.height);
      // 给粒子一个随机速度
      let v = {
        x: (Math.random() * 0.1 - 0.05) * this.option.particleSpeed,
        y: (Math.random() * 0.1 - 0.05) * this.option.particleSpeed
      }
      points.push({ x, y, v })
    }
    return points;
  }

  drawPoints() {
    this.points.forEach(point => {
      this.drawPoint(point)
    });
  }

  drawPoint(point) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.option.particleSize, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.option.particleColor;
    this.ctx.fill();
    // 碰到边界反弹
    if (point.x <= 0 || point.x >= this.width) {
      point.v.x = -point.v.x;
      if (point.x >= this.width) {
        point.x = this.width;
      }
    }
    if (point.y <= 0 || point.y >= this.height) {
      point.v.y = -point.v.y;
      if (point.y >= this.height) {
        point.y = this.height;
      }
    }
    point.x = point.x + point.v.x;
    point.y = point.y + point.v.y;
  }

  drawLines() {
    this.points.forEach(point1 => {
      this.points.forEach(point2 => {
        if (point1 === point2) return;
        if (Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) < Math.pow(this.option.lineMaxLength, 2)) {
          this.drawLine(point1, point2);
        }
      })
    })
  }

  drawLine(start, end) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = this.getColor(start, end);
    this.ctx.width = this.option.lineWidth;
    this.ctx.stroke();
  }

  getColor(start, end) {
    let rate = (Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)) / Math.pow(this.option.lineMaxLength, 2);
    let alpha = Math.floor(30 * (1 - rate));
    alpha = alpha < 10 ? '0' + alpha : alpha;
    return this.option.lineColor + alpha;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawPoints();
    this.drawLines();
    this.renderId = requestAnimationFrame(() => {
      this.render();
    });
  }

  start() {
    this.render();
  }

  stop() {
    cancelAnimationFrame(this.renderId);
  }

}