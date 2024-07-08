class TrackBall {
  constructor(trackIndex, x, y, z) {
    this.trackIndex = trackIndex;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updatePosition(currentPulse, note, baseWidth, baseHeight, middleC) {
    this.x = (currentPulse / midiData.ppqn) * baseWidth;
    this.y = - (baseHeight * note.note) - 10; // Position just above the note box
  }

  display() {
    push();
    translate(this.x, this.y, this.z + 10);
    fill(100, 102, 204, 250);
    noStroke();
    sphere(10);
    pop();
  }
}