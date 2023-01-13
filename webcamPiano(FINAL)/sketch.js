/*
    # Final Assignment
    - Webcam Piano

# About the project
    Step 1: Renaming of backImg to prevImg has taken place. 
    Step 2: Frame differencing implemented by moving prevImg around. 
    Step 3: Learner has included Grid.js correctly and grid activates with movement.
    Step 4: Learner has included blur in order to reduce the amount of noise that activates the grid.
    Step 5: Learner has scaled down images processed (currImg, diffImg) so that the sketch runs fast after blurring has slowed it down.
    Step 6: How much has the learner extended the sketch? Learner has included comments about the extension and shows understanding of techniques 
            learnt throughout the course.
        -> I changed the colours of the circles.
        -> I added more to create a ripple effect.
        -> I added notes, making it play sounds when the grid is activated.
        -> I implemented a custom “Note” class that is used in Grid.js. Instead of an array of values for noteSize, notePos and noteState i have 
           an array of notes.
*/



// ********************************
// BACKGROUND SUBTRACTION EXAMPLE *
// ********************************
var video;
var prevImg; //Step 1: backImg -> prevImg
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;
var sound;

function preload(){
    sound = loadSound("assets/music-box-the-flea-waltz.wav");
}

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);
    // Step 3:
    grid = new Grid(640, 480);
}

function draw() {
    background(0);
    image(video, 0, 0);
    
    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(currImg.width/4, currImg.height/4); // Step 5:
    currImg.filter(BLUR, 3); // Step 4:

    diffImg = createImage(video.width, video.height);
    diffImg.resize(diffImg.width/4, diffImg.height/4); // Step 5:
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
               //code here
               var index = ((currImg.width*y)+x) *4;

               var redSource = currImg.pixels[index+0];
               var greenSource = currImg.pixels[index+1];
               var blueSource = currImg.pixels[index+2];

               var redBack = prevImg.pixels[index+0];
               var greenBack = prevImg.pixels[index+1];
               var blueBack = prevImg.pixels[index+2];

               var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if(d>threshold){
                    diffImg.pixels[index+0] = 0;
                    diffImg.pixels[index+1] = 0;
                    diffImg.pixels[index+2] = 0;
                    diffImg.pixels[index+3] = 255;
                }else{
                    diffImg.pixels[index+0] = 255;
                    diffImg.pixels[index+1] = 255;
                    diffImg.pixels[index+2] = 255;
                    diffImg.pixels[index+3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);
    //Step 3:
    copyCurrentToPrevImg();
    grid.run(diffImg);
}

function copyCurrentToPrevImg(){
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
}


function keyPressed() {
    // console.log("saved new background");
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
