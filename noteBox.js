class NoteBox {
  constructor(note, trackOffset, baseWidth, baseHeight, middleC) {
    this.note = note;
    this.trackOffset = trackOffset;
    this.boxWidth = baseWidth * note.duration_ratio;
    this.boxHeight = baseHeight * note.note;
    this.y = - this.boxHeight / 2;
    this.x = 0; // Will be set in display
    this.z = 0; // Will be set in display
  }

  display(noteBoxX, noteBoxZ) {
    this.x = noteBoxX + this.boxWidth / 2;
    this.z = noteBoxZ + this.trackOffset;
    // the push() and pop() functions are used to save and restore the drawing state, ensuring that each note box is translated independently of the others
    push();
    translate(this.x, this.y, this.z);
    
    fill(255, 204, 204, 250);
    stroke(255, 0, 204);
    //pointLight(150, 210, 210, -250, -150, 400);
    //noStroke();
    //normalMaterial();
    box(this.boxWidth, this.boxHeight, boxDepth);
    pop();
  }

  translated(currentX) {
    return currentX + this.boxWidth / 2;
  }

}