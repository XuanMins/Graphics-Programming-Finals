/*
# Final Assignment
    -Instagram Filter

# About the project
    Step 1: Sepia filter has been implemented successfully and images look very similar to the ones provided by the instructor.
    Step 2: Vignetting has been achieved using the map() and constrain() functions (code check required) and results look very similar to the ones      
            provided by the instructor.
    Step 3: Radial blur has been achieved using the map() and constrain() functions (code check required). Clicking on the face of the boy in the colour 
            image replicates the results provided by the instructor.
    Step 4: Borders recreated using the technique suggested by the instructor.
    Step 5: Did the student successfully and clearly implement functionality to switch from the main filter effect to some other filter effects?
        -> Added another 2 filters (Greenish & Pinkish)
        -> Press 1: Sepia Filter
        -> Press 2: Pinkish Filter
        -> Press 3: Greenish Filter
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var currentImgFilter;
var filterName;

var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
    currentImgFilter = earlyBirdFilter;
    filterName = "Early Bird Filter"
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    imgFilter(currentImgFilter(imgIn));
    textSize(32);
    fill(255);
    text('Press 1 or 2 or 3 to change your filter', 10, 700);
    text('Current Filter: ' + filterName, 950, 680);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function keyPressed(){
  if(key == 1){
    currentImgFilter = earlyBirdFilter;
    filterName = "Early Bird Filter";
    loop();
  }
  if(key == 2){
    currentImgFilter = pinkishFilter;
    filterName = "Pinkish Filter";
    loop();
  }
  if(key == 3){
    currentImgFilter = greenishFilter;
    filterName = "Greenish Filter";
    loop();
  }

}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(imgIn, resultImg);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function pinkishFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = pinkFilter(imgIn, resultImg);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function greenishFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = greenFilter(imgIn, resultImg);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}
// Step 4: Borders  
function borderFilter(imgIn){
  // Draw img into buffer.
  var resultImg = createGraphics(imgIn.width, imgIn.height);
  resultImg.image(imgIn, 0, 0);

  // Draw rect with corners
  resultImg.noFill();
  resultImg.stroke(255);
  resultImg.strokeWeight(20);
  resultImg.rect(0, 0, imgIn.width, imgIn.height, 50);
  // Draw rect
  resultImg.noFill();
  resultImg.stroke(255);
  resultImg.strokeWeight(20);
  resultImg.rect(0, 0, imgIn.width, imgIn.height);

return resultImg;

}

function imgFilter(filter) {
  image(filter,imgIn.width,0)
}
// Step 3: Radial Blur
function radialBlurFilter(imgIn){
  imgIn.loadPixels();

  for(var x = 0; x < imgIn.width; x++)
  {
    for(var y = 0; y < imgIn.height; y++)
    {
      var pixelIndex = ((imgIn.width * y) + x) * 4;
      var oldRed = imgIn.pixels[pixelIndex + 0];
      var oldGreen = imgIn.pixels[pixelIndex + 1];
      var oldBlue = imgIn.pixels[pixelIndex + 2];

      var c = convolution(x, y, matrix, matrix.length, imgIn);

      var mouseDist = abs(dist(x, y, mouseX, mouseY));
      var dynBlur = map(mouseDist, 100, 300, 0, 1);
      dynBlur = constrain(dynBlur, 0, 1);

      var newRed   = c[0]*dynBlur + oldRed*(1-dynBlur);
      var newGreen  = c[1]*dynBlur + oldGreen*(1-dynBlur);
      var newBlue = c[2]*dynBlur + oldBlue*(1-dynBlur);

      imgIn.pixels[pixelIndex + 0] = newRed;
      imgIn.pixels[pixelIndex + 1] = newGreen;
      imgIn.pixels[pixelIndex + 2] = newBlue;
    }
  }

  imgIn.updatePixels();
  return imgIn;
}

function convolution(x, y, matrix, matrixSize, img){
  var totalRed = 0.0;
  var totalGreen = 0.0; 
  var totalBlue = 0.0;
  
  var offset = floor(matrixSize / 2);

  // convolution matrix loop
  for(var i = 0; i < matrixSize; i++)
  {
    for(var j = 0; j < matrixSize; j++)
    {
      // Get pixel location within convolution matrix
      var xloc = x + i - offset;
      var yloc = y + j - offset;
      var index = (xloc + img.width * yloc) * 4;
      // ensure we don't address a pixel that doesn't exist
      index = constrain(index, 0, img.pixels.length - 1);

      // multiply all values with the mask and sum up
      totalRed += img.pixels[index + 0] * matrix[i][j];
      totalGreen += img.pixels[index + 1] * matrix[i][j];
      totalBlue += img.pixels[index + 2] * matrix[i][j];
    }
  }
  return[totalRed, totalGreen, totalBlue];
}
// Step 2: Vignetting (Dark Corners)
function darkCorners(imgIn){
  imgIn.loadPixels();

  var midX = imgIn.width/2;
  var midY = imgIn.height/2;
  var maxDist = abs(dist(midX, midY, 0, 0));
  var dynLum = 1;

  for(var x = 0; x < imgIn.width; x++)
  {
    for(var y = 0; y < imgIn.height; y++)
    {
      var d = abs(dist(midX, midY, x, y));
      if(d > 300)
      {
        var pixelIndex = ((imgIn.width * y) + x) * 4;
        var oldRed = imgIn.pixels[pixelIndex + 0];
        var oldGreen = imgIn.pixels[pixelIndex + 1];
        var oldBlue = imgIn.pixels[pixelIndex + 2];

        if(d <= 450)
        {
          dynLum = map(d, 300, 450, 1, 0.4);
        }
        else
        {
          dynLum = map(d, 450, maxDist, 0.4, 0);
        }

        dynLum = constrain(dynLum, 0, 1);
        imgIn.pixels[pixelIndex+0] = oldRed * dynLum;
        imgIn.pixels[pixelIndex+1] = oldGreen * dynLum;
        imgIn.pixels[pixelIndex+2] = oldBlue * dynLum;
      }
    }
  }

  imgIn.updatePixels();
  return imgIn;

}
// Step 1: Sepia Filter
function sepiaFilter(imgIn,resultImg){

  imgIn.loadPixels();
  resultImg.loadPixels();

  for(var x = 0; x < imgIn.width; x++){
    for(var y = 0; y < imgIn.height; y++){
      var pixelIndex = ((imgIn.width * y) + x) * 4;
      var oldRed = imgIn.pixels[pixelIndex + 0];
      var oldGreen = imgIn.pixels[pixelIndex + 1];
      var oldBlue = imgIn.pixels[pixelIndex + 2];

      var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
      var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
      var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)

      newRed = constrain(newRed, 0, 255);
      newGreen = constrain(newGreen, 0, 255);
      newBlue = constrain(newBlue, 0, 255);

      resultImg.pixels[pixelIndex + 0] = newRed;
      resultImg.pixels[pixelIndex + 1] = newGreen;
      resultImg.pixels[pixelIndex + 2] = newBlue;
      resultImg.pixels[pixelIndex + 3] = 255;

    }
  }

  resultImg.updatePixels();
  return resultImg;
}
// Step 5: Additional Filter
function pinkFilter(imgIn,resultImg){

  imgIn.loadPixels();
  resultImg.loadPixels();

  for(var x = 0; x < imgIn.width; x++){
    for(var y = 0; y < imgIn.height; y++){
      var pixelIndex = ((imgIn.width * y) + x) * 4;
      var oldRed = imgIn.pixels[pixelIndex + 0];
      var oldGreen = imgIn.pixels[pixelIndex + 1];
      var oldBlue = imgIn.pixels[pixelIndex + 2];

      var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
      var newGreen = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)
      var newBlue = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)

      newRed = constrain(newRed, 0, 255);
      newGreen = constrain(newGreen, 0, 255);
      newBlue = constrain(newBlue, 0, 255);

      resultImg.pixels[pixelIndex + 0] = newRed;
      resultImg.pixels[pixelIndex + 1] = newGreen;
      resultImg.pixels[pixelIndex + 2] = newBlue;
      resultImg.pixels[pixelIndex + 3] = 255;

    }
  }

  resultImg.updatePixels();
  return resultImg;
}
// Step 5: Additional Filter
function greenFilter(imgIn,resultImg){

  imgIn.loadPixels();
  resultImg.loadPixels();

  for(var x = 0; x < imgIn.width; x++){
    for(var y = 0; y < imgIn.height; y++){
      var pixelIndex = ((imgIn.width * y) + x) * 4;
      var oldRed = imgIn.pixels[pixelIndex + 0];
      var oldGreen = imgIn.pixels[pixelIndex + 1];
      var oldBlue = imgIn.pixels[pixelIndex + 2];

      var newRed = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
      var newGreen = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
      var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)

      newRed = constrain(newRed, 0, 255);
      newGreen = constrain(newGreen, 0, 255);
      newBlue = constrain(newBlue, 0, 255);

      resultImg.pixels[pixelIndex + 0] = newRed;
      resultImg.pixels[pixelIndex + 1] = newGreen;
      resultImg.pixels[pixelIndex + 2] = newBlue;
      resultImg.pixels[pixelIndex + 3] = 255;

    }
  }

  resultImg.updatePixels();
  return resultImg;
}