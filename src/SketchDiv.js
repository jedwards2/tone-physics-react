import Sketch from "react-p5";
import Pole from "./Pole";
import Tone from "./Tone";

function SketchDiv() {
  let tones = [];
  let poleValues = [55, 110, 220, 440, 880, 1760];
  let poles = [];
  let massSlider;
  //set gravity (good at 1)
  const G = 2;

  let x = 50;
  let y = 50;

  const setup = (p5, canvasParentRef) => {
    let v1 = p5.createVector(3, 2, 4);
    let v2 = p5.constructor.Vector.div(v1, 2);
    console.log(v2);
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    // p5.createCanvas(500, 500).parent(canvasParentRef);
    let cnv = p5.createCanvas(p5.windowWidth, 1600).parent(canvasParentRef);
    cnv.position(0, 50);

    for (let q = poleValues.length - 1; q >= 0; q--) {
      let pole = new Pole(p5, poleValues[q], x * x, G);
      poles.push(pole);
      x += 1;
    }

    massSlider = p5.createSlider(11, 150, 10);
    massSlider.position(10, 10);
    massSlider.style("width", "80px");
    cnv.mousePressed((event) => {
      if (p5.mouseX > p5.width || p5.mouseY > p5.height || p5.mouseY < 0) {
        return;
      }
      let tone = new Tone(
        p5,
        p5.mouseY,
        massSlider.value(),
        tones,
        G,
        resetAllIndices
      );

      for (let i = tones.length - 1; i >= 0; i--) {
        let dist = tones[i].pos.y - p5.mouseY;
        let force = p5.createVector(0, dist);
        let distanceSq = p5.constrain(force.mag(), 1, 10000);

        let strength = (G * (tone.mass * tones[i].mass)) / distanceSq;

        force.setMag(strength);
        tones[i].applyForce(force);
      }

      tones.push(tone);
    });
  };

  const draw = (p5) => {
    p5.background(0);
    // p5.ellipse(x, y, 70, 70);
    // // NOTE: Do not use setState in the draw function or in functions that are executed
    // // in the draw function...
    // // please use normal variables or class properties for these purposes
    // x++;
    p5.background(0);
    let allPos = {};
    for (let q = poles.length - 1; q >= 0; q--) {
      poles[q].display();
    }
    for (let i = tones.length - 1; i >= 0; i--) {
      tones[i].recordHistory();
      tones[i].updateHistory();
      tones[i].updatePosition();
      tones[i].drag();
      for (let q = poles.length - 1; q >= 0; q--) {
        poles[q].attract(tones[i]);
      }

      tones[i].display();
      tones[i].loseMass();
      if (tones[i].checkMass()) {
        tones[i].mass = 0;
        for (let i = tones.length - 1; i >= 0; i--) {
          allPos[i] = [tones[i].pos.y, tones[i].mass];
        }
        // console.log(allPos);
        tones[i].removeTone();
        return;
      }
    }
    for (let i = tones.length - 1; i >= 0; i--) {
      allPos[i] = [tones[i].pos.y, tones[i].mass];
    }
    // console.log(allPos);
  };

  function resetAllIndices() {
    for (let i = tones.length - 1; i >= 0; i--) {
      tones[i].index = i;
    }
  }

  return <Sketch setup={setup} draw={draw} />;
}

export default SketchDiv;
