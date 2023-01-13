/*
* Final Assignment
    - Average Face
* About the project
    Step 1: Images loaded successfully using a for-loop (check code).
    Step 2: Face appears on the left, grey canvas on the right.
    Step 3: Image initialised correctly within setup() function (check code).
    Step 4: Images are looped over and loadPixels() is called on them.
    Step 5: Face appears on the left, and the right side of the canvas is red. Conversion from 2D to 1D coordinates has taken place (check code).
    Step 6: Average image appears on right side of the canvas.
    Step 7: Points awarded based on whether the solutions to the ideas for further development where correctly implemented.
        -> Press Space bar to change the image showing on the left.
        -> Click on the mouse whilst moving to the right will show you the transition of the average face image to the original image on the left.
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var imgs = [];
var avgImg;
var numOfImages = 30;
var ranImg;

var loadCounter = 0;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    // Step 1: load images in
    for(var i = 0; i < numOfImages; i++)
    {
        var filename = "assets/" + i + ".jpg"
        var img = loadImage(filename, imgLoadSuccess);
        imgs.push(img);
    }

}

function imgLoadSuccess() {
    loadCounter++;
    console.log(loadCounter);
}


//////////////////////////////////////////////////////////
function setup() {
    createCanvas(512 * 2, 512);
    pixelDensity(1);
    // Step 3
    ranImg = random(imgs);
}
//////////////////////////////////////////////////////////
// Step 7:
function mousePressed(){
    loop();
}
//////////////////////////////////////////////////////////
function keyPressed(){
    if (key == ' ')
    {
        ranImg = random(imgs);
        loop();
    }
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    if(loadCounter!=numOfImages)
    {
        console.log("not ready");
        return;
    }
    console.log("All images loaded, ready for average face!");
    var img = averageFace(imgs);
    // Step 2: Original image on left
    image(ranImg,  0, 0);
    // Step 6: Average face on right
    image(ranImg, img.width, 0);
    // Step 7: show the original image on right to see the average face change from the original image
    image(img, img.width, 0);

    //instructions
    textSize(35);
    fill(255, 0, 255);
    text('Press spacebar to change image.', 10, 40);
    text('Move your mouse to the right', 522, 470);
    text(' whilst clicking the mouse.', 515, 500);

    noLoop();

}

function averageFace(images){
    console.log("In average face");
    // Step 4:
    // load the pixels of all images in the array
    for(var i = 0; i < images.length; i++)
    {
        images[i].loadPixels();
    }

    // Create a blank image to store all the average RGB values
    avgImg = createGraphics(images[0].width, images[0].height);

    avgImg.loadPixels();

    // Step 5:
    // For each row
    for(var y = 0; y < avgImg.height; y++)
    {
        // For each column
        for(var x = 0; x < avgImg.width; x++)
        {
            var pixelIndex = ((avgImg.width * y) + x) * 4;

            // Compute RGB average for each pixel for all images
            var sumR = 0;
            var sumG = 0; 
            var sumB = 0;
            

            // Get the RGB value for the pixel of each image in images
            for(var i = 0; i < images.length; i ++)
            {
                var img = images[i];
                sumR += img.pixels[pixelIndex + 0]; 
                sumG += img.pixels[pixelIndex + 1];
                sumB += img.pixels[pixelIndex + 2];
            }

            avgImg.pixels[pixelIndex + 0] = sumR/images.length;
            avgImg.pixels[pixelIndex + 1] = sumG/images.length;
            avgImg.pixels[pixelIndex + 2] = sumB/images.length;
            avgImg.pixels[pixelIndex + 3] = map(mouseX, width/2, width, 255, 0, true);
        }
    }

    avgImg.updatePixels();
    return avgImg;

}

