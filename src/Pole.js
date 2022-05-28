class Pole {
  constructor(p5, y, m, G) {
    this.p = p5;
    this.pos = p5.createVector(p5.width, y);
    this.mass = m;
    this.width = p5.sqrt(this.mass) * 10;
    this.G = G;
  }

  attract(tone) {
    let force = this.p.constructor.Vector.sub(this.pos, tone.pos);
    let distanceSq = this.p.constrain(force.magSq(), 100, 10000);

    let strength = (this.G * (this.mass * tone.mass)) / distanceSq;
    force.setMag(strength);
    tone.applyForce(force);
  }

  display() {
    this.p.noFill();
    this.p.stroke(255, 255, 255, 100);
    this.p.line(0, this.pos.y, this.p.width, this.pos.y);
  }
}

export default Pole;
