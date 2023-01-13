/*
# Final Assignment
    - 3D Sine Games

# About my project
    Step1: A grid of tiles of the right size, spread over the right area, has been produced.
    Step2: Correct material and stroke is on display.
    Step3: Structure is wavy like the demo at the top of the page.
    Step4: Camera flies around like in the demo at the top of the page.
    Step5: Confetti appear on top of the structure like in the demo, at random locations and random angles, but do not necessarily animate.
    Step6: Confetti is falling downwards and is also rotating. When it reaches 0 on the y axis it resets to the top.
    Step7: Has the student implemented ideas for further development?
        -> Change from normalMaterial -> specularMaterial
        -> Add poinLight
        -> Add sliders for speed and height of wave
        -> First slider - wave speed
        -> Second slider - wave height
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var confLocs;
var confTheta;

let waveSlider;
let boxHeightSlider;

function preload(){
    fonts = loadFont('assets/Inkfree.ttf');
}

function setup() {
    createCanvas(900, 800, WEBGL);
    camera(800, -600, 800, 0, 0, 0, 0, 1, 0);
    angleMode(DEGREES);

    // Step7:
    waveSlider = createSlider(1, 20, 1);
    waveSlider.position(10,10);
    waveSlider.style('width', '80px');

    boxHeightSlider = createSlider(1, 3, 1, 0.1);
    boxHeightSlider.position(10,30);
    boxHeightSlider.style('width', '80px');

    // Step5:
    // Global arrays for confetti
    confLocs = [];
    confTheta = [];

    for(var i = 0; i <200; i++)
    {
        var r_x = random(-500, 500);
        var r_y = random(-800, 0);
        var r_z = random(-500, 500);
        var r_v = createVector(r_x, r_y, r_z);
        confLocs.push(r_v);
        var r_a = random(0, 360);
        confTheta.push(r_a);
    }
}

function draw() {
    background(125);
    angleMode(DEGREES);

    push();
    let val = waveSlider.value();
    let val2 = boxHeightSlider.value();

    // Step4:
    var xLoc = cos(frameCount) * height * 1.3;
    var zLoc = sin(frameCount) * height * 1.3;
    camera(xLoc, -600, zLoc, 0, 0, 0, 0, 1, 0);

    // Step2:
    let locX = mouseX - width/2;
    let locY = mouseY - height/2;
    pointLight(random(0,255), random(0,255), random(0,255), locX, locY, 100);   // Step7: Add poinLight
    //normalMaterial();
    specularMaterial(random(0,255), random(0,255), random(0,255), 255); // Step7: change from normalMaterial -> specularMaterial
    stroke(random(0,255), random(0,255), random(0,255));
    strokeWeight(2);

    // Step1:
    for(var x = -400; x <= 400; x += 50)
    {
        for(var z = -400; z <= 400; z += 50)
        {
            push(); 
            translate(x, 0, z);

            // Step3:

            var distance = dist(0, 0, x, z) + frameCount * val;
            var length = map(sin(distance), -1, 1, 100, 300);
            box(50, length * val2, 50);

            pop();
        }
    }
    pop();
    confetti();
    
}

    // Step5:
function confetti(){
    for(var i = 0; i < confLocs.length; i++)
    {
        push();
        noStroke();
        fill(random(0,255), random(0,255), random(0,255));
        translate(confLocs[i].x, confLocs[i].y, confLocs[i].z);
        rotateX(confTheta[i]);
        plane(15, 15);

        // Step6:
        confLocs[i].y += 1;
        confTheta[i] += 10;

        if(confLocs[i].y > 0)
        {
            confLocs[i].y = -800;
        }
        pop();
    }
}

