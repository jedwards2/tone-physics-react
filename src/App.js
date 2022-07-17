import SketchDiv from "./SketchDiv";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import "./App.css";

function App() {
  const [distortion, setDistortion] = useState(0.5);
  const [reverb, setReverb] = useState(4);

  return (
    <div className="app-div">
      <div className="header">
        <h1>Tone Physics</h1>
      </div>
      <div className="main--div">
        <div className="sketch--div">
          <SketchDiv distortion={distortion} reverb={reverb} />
        </div>
        <div className="sidebar">
          <div className="synth-controls">
            <h1>Distortion</h1>
            <Slider
              size="small"
              defaultValue={50}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChange={(value) => setDistortion(value.target.value / 100)}
              min={1}
              max={100}
            />
          </div>
          <div className="synth-controls">
            <h1>Reverb</h1>
            <Slider
              size="small"
              defaultValue={4}
              aria-label="Small"
              valueLabelDisplay="auto"
              min={1}
              max={20}
              onChange={(value) => setReverb(value.target.value)}
            />
          </div>
          <div className="text-box">
            <h1>About</h1>
            <p>Physics system for musical tones in the browser. </p>
            <p>Built with React and Tone.js</p>
            <h2>To Use:</h2>
            <p>Click anywhere in the canvas to create a new Tone.</p>
            <p>Adjust the distortion and reverb amounts for any new Tone.</p>
          </div>
          <div className="text-box">
            <h1>Created by:</h1>
            <a href="https://github.com/jedwards2">jedwards2</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
