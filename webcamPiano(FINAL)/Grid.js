// Step 6:
let monoSynth = new p5.MonoSynth();
//initialise array of notes to be played by monoSynth
let notes = [
  ["A6", "C3", "F#6"],
  ["F4", "E4", "D6"],
  ["D6", "C6", "B4"],
  ["G3", "A4", "Fb4"],
  ["E5", "G4", "C4"],
  ["C4", "E4", "F#6"],
  ["F#3", "A4", "C5"],
  ["Fb3", "D6", "B5"],
  ["G#5", "E3", "C#4"],
  ["A#3", "F4", "D5"]
];
// Step 3:
class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];

    // this.notes = [];

    // initalise grid structure and state
    // Note.noteSize = 40;
    // console.log(Note.noteSize);
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
      // this.notes.push(new Note(posColumn, stateColumn));
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {
          var alpha = this.noteState[i][j] * 220;
          var c1 = color(93, 208, 255,alpha);
          var c2 = color(210, 31, 255,alpha);

          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          stroke(255);
          var s = this.noteState[i][j];
          var outerCircle = 1 - this.noteState[i][j];
          var mapOuterCircle = map(outerCircle, 0,1, 1,2);
            
          //original ellipse
          ellipse(x, y, this.noteSize*s, this.noteSize*s);
            push();
            //outer circle ring
            stroke(color(255,255,230,alpha*0.3));
            strokeWeight(5);
            ellipse(x, y, this.noteSize*mapOuterCircle, this.noteSize*mapOuterCircle);
            
              //inner circle ring
              push();
              stroke(color(255,255,230,alpha*0.2));
              ellipse(x, y, this.noteSize*s*0.5, this.noteSize*s*0.5);
              pop();
          
              push();
              mix.setAlpha(alpha*0.2);
              fill(mix);
              noStroke();
              ellipse(x, y, this.noteSize*mapOuterCircle*2, this.noteSize*mapOuterCircle*2);
              pop();

            pop();
            
            //**RANDOM ELEMENT**
            //original position
            //create random element of white circling ripples
            var randomElement = int(random(1,100));
            noFill();
            stroke(color(255,255,230));
            if(randomElement == 25){
                ellipse(x,y, this.noteSize*mapOuterCircle*1.5, this.noteSize*mapOuterCircle*1.5);
            }

          var noteX = map(x, 0, this.gridWidth, 0, 7) | 0;
          var noteY = map(y, 0, this.gridHeight, 0, 3) | 0;
          this.playSynth(noteX, noteY);
        }
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
    // Step 6:
    playSynth(noteX, noteY){
      // Start audio
      userStartAudio();
      let note = notes[noteX][noteY];
      let velocity = random();
      monoSynth.play(note, velocity, 0, 1/64);
  }
}
