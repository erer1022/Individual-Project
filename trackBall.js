class TrackBall {
  constructor(trackIndex, x, y, z) {
      this.trackIndex = trackIndex;
      this.x = x;
      this.y = y;
      this.z = z;
      this.t = 0;
      this.jumpX = 0; // Variables to store the jump animation state
      this.jumpY = 0;
      this.angle = 0;
      this.isJumping = false;
  }

  updatePosition(currentPulse, note, baseWidth, baseHeight, middleC) {
      this.x = (currentPulse / midiData.ppqn) * baseWidth;
      this.y = - (baseHeight * note.note) - 10; // Position just above the note box
  }

  jump(currentPulse, baseWidth) {
      this.isJumping = true;
      let jumpDuration = (currentPulse / midiData.ppqn) * baseWidth - this.x;
      // Calculate the jumping box position
      this.x += jumpDuration;
      
  }

  display() {
      if (!this.isJumping) {
          push();
          translate(this.x, this.y, this.z + 10);
          fill(235, 229, 114, 200);
          stroke(255, 255, 255);
          box(13);
          pop();
      } else {
          // Draw the jumping box
          push();
          translate(this.x, this.y, this.z + 10);
          rotateZ(this.angle);
          fill(235, 229, 114, 200); // Yellow color
          box(13);
          pop();

          // Increment the angle for rotation
          this.angle += 0.1;
      }
  }
}