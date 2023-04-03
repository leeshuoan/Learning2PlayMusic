import { Button, Card, Grid, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import * as Tone from "tone";

const RhythmMachine = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [sequence, setSequence] = useState([false, false, false, false]);
  const colors = ["#576CBC", "#19376D", "0B2447", "#262A56"];
  const synth = new Tone.Synth().toDestination();

  const handleToggleNote = (index) => {
    const newSequence = [...sequence];
    newSequence[index] = !newSequence[index];
    setSequence(newSequence);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (event) => {
    setBpm(parseInt(event.target.value));
  };

  const stepLength = Tone.Time("16n").toSeconds();
  const steps = new Tone.Sequence(
    (time, index) => {
      if (sequence[index]) {
        synth.triggerAttackRelease(["C4", "D#4", "F#4"][index], "16n", time);
      }
    },
    [0, 1, 2, 3],
    "4n"
  );

  Tone.Transport.scheduleRepeat(() => {
    steps.start();
  }, "4n");

  Tone.Transport.bpm.value = bpm;
  Tone.Transport.start();

  if (isPlaying) {
    Tone.Transport.start();
  } else {
    Tone.Transport.stop();
  }

  return (
    <Card sx={{ p: 3, mt: 3, mb: 4 }}>
      <Grid container sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your rhythm guide
          </Typography>
        </Grid>
        <Grid item xs={12} >
          <Typography variant="body2">Click on the buttons to create your own rhythm. You can also change the tempo of the rhythm by using the slider.</Typography>
        </Grid>
        {sequence.map((step, index) => (
          <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
            <Button key={index} variant="contained" onClick={() => handleToggleNote(index)} sx={{ width: "50%", height: "100px", m: 3, backgroundColor: colors[index] }}>
              {step ? "X" : "O"}
            </Button>
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 5 }}>
          <Typography id="bpmLabel" gutterBottom>
            Beats per minute
          </Typography>
          <Slider value={bpm} aria-labelledby="bpmLabel" onChange={handleBpmChange} min={40} max={240} valueLabelDisplay="on" />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="success" onClick={handleTogglePlay} sx={{ width: "100%", display: "flex", justifyContent: "center", color: "black" }}>
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RhythmMachine;
