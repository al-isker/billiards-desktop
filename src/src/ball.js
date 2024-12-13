const RADIUS = 15;

class Ball {
  constructor (num) {
    this.num = num;
    this.type = this.getType(num);
    this.radius = RADIUS;
    this.size = this.radius * 2;
    this.pos = [0,0];
    this.vel = [0,0];
    this.wallCollided = false;
    this.onTable = true; 
    this.sinking = false;

    this.img = new Image();    
    this.img.src = `src/assets/images/ball_${this.num}.png`

  }

  isStationary() {
    return (this.vel[0] === 0 && this.vel[1] === 0);
  }
  
  resetBall() {
    this.vel[0] = 0;
    this.vel[1] = 0;
    this.size = this.radius * 2;
    this.onTable = true;
    this.sinking = false;
  }

  getType(num) {
    if (num === 0) {
      return "white"
    } else if (num < 8) {
      return "solid";
    } else if (num > 8) {
      return "stripe";
    } else if (num === 8) {
      return "eight"
    }
  }

  draw(ctx) {      
    if (this.onTable) {     
      ctx.drawImage(this.img, 
        Math.round(this.pos[0] - this.radius), 
        Math.round(this.pos[1] - this.radius),
        this.size,
        this.size
      );
    }

    if (this.sinking && this.size >= 0) {
      ctx.drawImage(this.img, this.pos[0] - this.radius, this.pos[1] - this.radius, this.size--, this.size--);
    }
  }

  move(timeDelta) {
    const velScale = timeDelta / (1000 / 60);
    let x = this.pos[0];
    let y = this.pos[1];
    let dx = this.vel[0] * velScale;
    let dy = this.vel[1] * velScale;

    this.pos = [x + dx, y + dy]; 
    
    if (dx !== 0) {
      Math.abs(dx) < .05 ? this.vel[0] = 0 : this.vel[0] *= .994;
    }

    if (dy !== 0) {
      Math.abs(dy) < .05 ? this.vel[1] = 0 : this.vel[1] *= .994;
    }

    if ((x > 1180 || x < 20) || (y < 20 || y > 580)) {
      this.resetBall();
      this.pos = [
        Math.floor(Math.random() * 1000) + 200, 
        Math.floor(Math.random() * 600) + 50, 
        ];
    } 
    
  }

  collideEdge(wall) {
    let vx = this.vel[0];
    let vy = this.vel[1];
    let notCollided = true;

    if (notCollided) {
      if (wall.type === 'horizontal') {
        this.vel = [vx, -vy];
      } else if (wall.type === 'vertical') {
        this.vel = [-vx, vy];
      } else if (wall.type === '1-diag') {
        this.vel = [-vy, -vx];
      } else if (wall.type === '2-diag') {
        this.vel = [vy, vx];
      } 
      notCollided = false;
    }

    setTimeout( () => {
      notCollided = true;
    }, 100);
      
    let buffer = 3;
    if (wall.location === 'top') {
      this.pos[1] += buffer;
    } else if (wall.location === 'bottom') {
      this.pos[1] -= buffer;
    } else if (wall.location === 'left') {
      this.pos[0] += buffer;
    } else if (wall.location === 'right') {
      this.pos[0] -= buffer;
    }
  }  

  sink() {
    this.onTable = false;
    this.vel[0] = 0;
    this.vel[1] = 0;
    this.sinking = true;    
  }
}

module.exports = Ball;