class NoteBox {
  constructor(note, trackOffset, baseWidth, baseHeight, middleC) {
    this.note = note;
    this.trackOffset = trackOffset;
    this.boxWidth = baseWidth * note.duration_ratio;
    this.boxHeight = baseHeight * note.note;
    this.y = - this.boxHeight / 2;
    this.x = 0; // Will be set in display
    this.z = 0; // Will be set in display
    this.isActivated = false;
    this.alpha = 250;
  }

  display(noteBoxX, noteBoxZ) {
    this.x = noteBoxX + this.boxWidth / 2;
    this.z = noteBoxZ + this.trackOffset;
    // the push() and pop() functions are used to save and restore the drawing state, ensuring that each note box is translated independently of the others
    push();
    translate(this.x, this.y, this.z);

    if (this.isActivated) {
      this.alpha = 100; // Change alpha to a different value when activated
      this.showNoteInfo(noteBoxX);
    } else {
      this.alpha = 250; // Default alpha value
    }
    
    if (this.note.octave === -1) {
      fill(50 + this.note.note % 12 * 2, 69, 76, this.alpha);
    } else if (this.note.octave === 0) {
      fill(80 + this.note.note % 12 * 2, 108, 127, this.alpha);
    } else if (this.note.octave === 1) {
      fill(70 + this.note.note % 12 * 2, 97, 142, this.alpha);
    } else if (this.note.octave === 2) {
      fill(100 + this.note.note % 12 * 2, 136, 193, this.alpha);
    } else if (this.note.octave === 3) {
      fill(120 + this.note.note % 12 * 2, 165, 234, this.alpha);
    } else if (this.note.octave === 4) {
      fill(90 + this.note.note % 12 * 2, 150, 248, this.alpha);
    } else if (this.note.octave === 5) {
      fill(30 + this.note.note % 12 * 2, 115, 248, this.alpha);
    } else if (this.note.octave === 6) {
      fill(110 + this.note.note % 12 * 2, 166, 179, this.alpha);
    } else if (this.note.octave === 7) {
      fill(120 + this.note.note % 12 * 2, 146, 150, this.alpha);
    } else if (this.note.octave === 8) {
      fill(170 + this.note.note % 12 * 2, 182, 149, this.alpha);
    } else if (this.note.octave === 9) {
      fill(130 + this.note.note % 12 * 2, 145, 122, this.alpha);
    } 
    
    stroke(255, 255, 255);
    //pointLight(150, 210, 210, -250, -150, 400);
    //noStroke();
    //normalMaterial();
    box(this.boxWidth, this.boxHeight, boxDepth);
    pop();
  }

  translated(currentX) {
    return currentX + this.boxWidth / 2;
  }

  showNoteInfo(noteBoxX) {
    // Drawing text in 2D coordinates, consider using screen coordinates
    push();
    // Convert 3D coordinates to screen coordinates
    let position = createVector(this.x - noteBoxX - this.boxWidth / 2, this.y + this.boxHeight / 2, 0);
    translate(position.x, position.y, position.z);
    fill(0);
    text(`${this.note.note_name} ${this.note.octave}`, 0, 0);
    pop();
  }
}

