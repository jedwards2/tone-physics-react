class Pole {
  constructor(p5, y, m, G) {
    this.pos = p5.createVector(p5.width, y);
    this.mass = m;
    this.width = p5.sqrt(this.mass) * 10;
    this.p5 = p5;
    this.G = G;
  }

  attract(tone) {
    let force = this.p5.constructor.Vector.sub(this.pos, tone.pos);
    let distanceSq = this.p5.constrain(force.magSq(), 100, 10000);

    let strength = (this.G * (this.mass * tone.mass)) / distanceSq;
    force.setMag(strength);
    tone.applyForce(force);
  }

  display() {
    this.p5.noFill();
    this.p5.stroke(255, 255, 255, 100);
    this.p5.line(0, this.pos.y, this.p5.width, this.pos.y);
  }
}

export default Pole;
