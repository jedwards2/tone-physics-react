class Tone {
  constructor(p5, y, m, tones, G, resetAllIndices) {
    this.pos = p5.createVector(p5.width, y);
    this.velocity = p5.createVector(0, 0);
    this.p = p5;

    this.acc = p5.createVector(0, 0);
    this.mass = m;
    this.r = p5.sqrt(this.mass) * 2;
    this.positionHistory = [];
    this.c = 255;
    this.historyCount = 0;
    this.tones = tones;
    this.tone = G;
    this.resetAllIndices = resetAllIndices;
  }

  drag() {
    let drag = this.velocity.copy();
    drag.normalize();
    drag.mult(-1);

    //set drag
    let c = 0.1;
    let speedSq = this.velocity.magSq();
    drag.setMag(c * speedSq);

    this.applyForce(drag);
  }

  applyForce(force) {
    let f = this.p.constructor.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  updatePosition() {
    this.velocity.add(this.acc);
    this.pos.add(this.velocity);
    //make sure it doesn't go negative
    if (this.pos.y < 1) {
      this.pos.y = 5;
      this.acc.y *= -1;
      this.velocity.y *= -1;
    }
    if (this.pos.y > this.p.height) {
      this.pos.y = 1590;
      this.acc.y *= -1;
      this.velocity.y *= -1;
    }

    //set acceleration back to 0
    this.acc.set(0, 0);
  }

  display() {
    this.p.push();
    this.p.stroke(this.c);
    let radius = this.mass / 2;
    this.p.circle(this.pos.x, this.pos.y, radius);
    this.p.pop();
  }

  recordHistory() {
    if (this.historyCount % 5 == 0) {
      this.positionHistory.push([this.pos.x, this.pos.y]);
    }

    this.historyCount += 1;
    // console.log(this.positionHistory.length);
  }

  updateHistory() {
    for (let i = this.positionHistory.length - 1; i >= 0; i--) {
      let alpha = this.p.map(
        this.positionHistory[i][0],
        this.p.width,
        80,
        255,
        0
      );
      //remove [x, y] position if x is less than 0
      if (this.positionHistory[i][0] < 0 || alpha < 10) {
        this.positionHistory.splice(i, 1);
      }

      //lower x by 1 and display onscreen
      this.positionHistory[i][0] -= 1;

      this.p.push();
      this.p.noStroke();

      this.p.fill(this.c, this.c, this.c, alpha);
      let radius = this.mass / 2;

      this.p.circle(
        this.positionHistory[i][0],
        this.positionHistory[i][1],
        radius
      );
      this.p.pop();
    }
  }

  loseMass() {
    // controls the decay of the tones
    this.mass -= 0.005;
  }

  checkMass() {
    if (this.mass <= 1) {
      return true;
    } else return false;
  }

  removeTone() {
    this.tones.splice(this.index, 1);
    this.resetAllIndices();
  }
}

export default Tone;