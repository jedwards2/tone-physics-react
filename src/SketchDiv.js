import Sketch from "react-p5";
import Pole from "./Pole";
import ToneCircle from "./Tone";
import { useState } from "react";

function SketchDiv({ distortion, reverb }) {
  const [tones, setTones] = useState([]);

  let poleValues = [55, 110, 220, 440, 880, 1760];
  const [poles, setPoles] = useState([]);
  // let massSlider;
  //set gravity (good at 1 or 2)
  const G = 2;

  const setup = (p5, canvasParentRef) => {
    let x = 1;
    let cnv = p5.createCanvas(800, 1600).parent(canvasParentRef);
    cnv.position(25, 120);
    //instantiate all poles in poleValues
    for (let q = poleValues.length - 1; q >= 0; q--) {
      let pole = new Pole(p5, poleValues[q], x * x, G);
      setPoles((prevState) => [...prevState, pole]);
      x += 1;
    }

    // massSlider = p5.createSlider(11, 150, 10);
    // massSlider.position(10, 100);
    // massSlider.style("width", "80px");

    //create new tone and add to list
    cnv.mousePressed(() => {
      if (p5.mouseX > p5.width || p5.mouseY > p5.height || p5.mouseY < 0) {
        return;
      }
      let tone = new ToneCircle(p5, p5.mouseY, 11, reverb, distortion);

      for (let i = tones.length - 1; i >= 0; i--) {
        let dist = tones[i].pos.y - p5.mouseY;
        let force = p5.createVector(0, dist);
        let distanceSq = p5.constrain(force.mag(), 1, 10000);

        let strength = (G * (tone.mass * tones[i].mass)) / distanceSq;

        force.setMag(strength);
        tones[i].applyForce(force);
      }
      //add tone to current list
      setTones((prevState) => {
        let newTones = [...prevState];
        newTones.push(tone);
        return newTones;
      });
    });
  };

  const draw = (p5) => {
    p5.background(0);
    let allPos = {};
    //display all poles
    for (let q = poles.length - 1; q >= 0; q--) {
      poles[q].display();
    }
    //update info for all tones current displayed
    for (let i = tones.length - 1; i >= 0; i--) {
      tones[i].recordHistory();
      tones[i].updateHistory();
      tones[i].updatePosition();
      tones[i].drag();
      for (let q = poles.length - 1; q >= 0; q--) {
        poles[q].attract(tones[i]);
      }

      tones[i].display();
      tones[i].play();
      tones[i].loseMass();
      //check that each tone is above threshold, otherwise remove
      if (tones[i].checkMass()) {
        tones[i].mass = 0;
        for (let i = tones.length - 1; i >= 0; i--) {
          allPos[i] = [tones[i].pos.y, tones[i].mass];
        }
        tones[i].removeToneCircle(setTones);
        resetAllIndices();
        return;
      }
    }
    //record all tone positions in dictionary
    for (let i = tones.length - 1; i >= 0; i--) {
      allPos[i] = [tones[i].pos.y, tones[i].mass];
    }
  };

  function resetAllIndices() {
    for (let i = tones.length - 1; i >= 0; i--) {
      tones[i].index = i;
    }
  }

  return <Sketch setup={setup} draw={draw} />;
}

export default SketchDiv;
