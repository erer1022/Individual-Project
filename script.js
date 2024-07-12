let midiData;
let testSong;
let font;
let tracks = [];
let maxDuration = 0;
let duration_ratio;
let maxPitch = 127;
let boxDepth = 60;
let canvasWidth = 800;
let canvasHeight = 600;
let baseWidth = 60;
let baseHeight = 1;
let middleC = 60;
let buttonPlay;
let ballPositions = [];
let pulseDuration;
let currentXOffset = 0;
let currentYOffset = 0;
let zoomFactor = 0.8;

function preload() {
  font = loadFont('./textFont/BaskervvilleSC-Regular.ttf');
  midiData = loadJSON('midi_data.json', processData);
  testSong = loadSound("canon-3.mp3", loaded, loadError);
  console.log("Preload finished");
}

function loadError(err) {
  console.error("Failed to load sound file:", err);
}

function processData(data) {
  console.log("Processing data");
  
  midiData = data;
  pulseDuration = midiData.pulse_duration;

  for (let i = 0; i < midiData.tracks.length; i++) {
    let track = midiData.tracks[i];
    tracks.push({
      name: track.name,
      notes: track.notes,
    });

    track.notes.forEach(note => {
      if (note.start_time + note.duration > maxDuration) {
        maxDuration = note.start_time + note.duration;
      }
      duration_ratio = note.duration_ratio;
      //console.log(`Note: ${note.note_name}, Duration:${note.duration_ratio}`);
    });
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  textFont(font);
  frameRate(60);
  noLoop();
}

function draw() {
  background(210);

  let orthoLeft = -canvasWidth / 2 * zoomFactor;
  let orthoRight = canvasWidth / 2 * zoomFactor;
  let orthoBottom = -canvasHeight / 2 * zoomFactor;
  let orthoTop = canvasHeight / 2 * zoomFactor;
  let orthoNear = -10000;
  let orthoFar = 10000;
  ortho(orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar);

  translate(-canvasWidth / 4 + currentXOffset, currentYOffset, 0);

  rotateX(-PI / 12);
  rotateY(PI / 10);
  //rotateZ(-PI / 40);

  // Draw lines parallel with the boxes
  for (let i = 0; i < midiData.total_duration_pulses; i += midiData.ppqn * 4) {
    let xPos = (i / midiData.ppqn) * baseWidth;
    stroke(255);
    line(xPos, 0, -800, xPos, 0, 1500);
  }
  

  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i];
    let trackOffset = i * 200;
    let notesByStartTime = {};

    track.notes.forEach(note => {
      if (!notesByStartTime[note.start_time]) {
        notesByStartTime[note.start_time] = [];
      }
      notesByStartTime[note.start_time].push(note);
    });

    let currentX = 0;
    let sortedStartTimes = Object.keys(notesByStartTime).sort((a, b) => parseFloat(a) - parseFloat(b));

    for (let j = 0; j < sortedStartTimes.length; j++) {
      let startTime = sortedStartTimes[j];
      let notes = notesByStartTime[startTime];
      currentX = (startTime / midiData.ppqn) * baseWidth;
      let z = 0;
      let previousTranslated = 0;

      notes.forEach(note => {
        let noteBox = new NoteBox(note, trackOffset, baseWidth, baseHeight, middleC);
        translate(-previousTranslated, 0, 0);
        
        // Check if this note is currently active and set isActivated
        let currentTime = testSong.currentTime();
        let currentPulse = currentTime / pulseDuration;
        if (note.start_time <= currentPulse && currentPulse < note.start_time + note.duration) {
            noteBox.isActivated = true;
        } else {
            noteBox.isActivated = false;
        }

        previousTranslated = noteBox.display(currentX, z);
        z += boxDepth;
        
        // initialize the ball's position
        if (ballPositions.length < i) {
          // constructor(trackIndex, x, y, z)
          ballPositions.push(new TrackBall(i, currentX, noteBox.y * 2 - 10, trackOffset));
        }
      });
    }
  }
  // Update the current and next notes for each track and balls
  updateNotesAndBalls();
}

let currentNotes = []; // Array to store current notes for each track
let nextNotes = []; // Array to store next notes for each track

function updateNotesAndBalls() {
  let currentTime = testSong.currentTime(); 
  let currentPulse = currentTime / pulseDuration;

  ballPositions.forEach(ball => {
      let notes = tracks[ball.trackIndex].notes;
      let noteAtCurrentPulse = notes.find(note => note.start_time <= currentPulse && currentPulse < note.start_time + note.duration);

      // Find the next few notes
      let futureNotes = notes.filter(note => note.start_time > currentPulse);
      let nextNote = futureNotes[0];
      let thirdNote = futureNotes[1];
      let fourthNote = futureNotes[2];

      // Store the current and next notes for the track
      currentNotes[ball.trackIndex] = noteAtCurrentPulse;
      nextNotes[ball.trackIndex] = nextNote;

      if (noteAtCurrentPulse) {
        // Update position
        ball.updatePosition(currentPulse, noteAtCurrentPulse, baseWidth, baseHeight, middleC);
        ball.isJumping = false;
      } else if (ball.x < ((currentPulse / midiData.ppqn) * baseWidth)) {
        ball.jump(currentPulse, baseWidth);
      }
      ball.display();
  });
}

  // if (noteAtCurrentPulse) {
  //   ball.updatePosition(currentPulse, noteAtCurrentPulse, baseWidth, baseHeight, middleC);
  // } else if (noteAtCurrentPulse && noteAtCurrentPulse.duration < midiData.ppqn){
  //   ball.jump(noteAtCurrentPulse, nextNote);
  // }
  // }
  
//   ball.display();
// });
// }



function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    currentXOffset -= 100;
  } else if (keyCode === RIGHT_ARROW) {
    currentXOffset += 100;
  }

  if (keyCode === UP_ARROW) {
    currentYOffset -= 100;
  } else if (keyCode === DOWN_ARROW) {
    currentYOffset += 100;
  }

  redraw();
}

function loaded() {
  console.log("Sound file loaded");
  buttonPlay = createButton('▶︎');
  buttonPlay.mousePressed(togglePlaying);
}

function togglePlaying() {
  if (!testSong.isPlaying()) {
    testSong.play();
    buttonPlay.html('◼︎');
    loop();
  } else {
    testSong.pause();
    buttonPlay.html('▶︎');
    noLoop();
  }
}