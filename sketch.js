let angle = [0,0];
let angleRate = 0.01;
let angle2 = [0,0];
let angleRate2 = 0.01
let radius = 100;
let tubeRadius = 25;
let radius2 = 100;
let tubeRadius2 = 25;
let increase = -1;
let size = 50
let sum;
let r = 200;
let g = 0;
let b = 0;
let avg;
let video;
let totalDiff;
let poseNet;
let pose;
let skeleton;
let prevRightX=0;
let prevLeftX=0;
let gotLandmark = false;
let doY = false;
let doX = false;
//Landmarks configured for my own camera
let landmark = [357,333];
const sentiment = ml5.sentiment('movieReviews');
let prediction;


function setup() {
  createCanvas(1000, 800);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video);
  
  poseNet.on('pose', gotPoses);
  myRec = new p5.SpeechRec('en-US'); // new P5.SpeechRec object
  myRec.continuous = true; // do continuous recognition
  myRec.interimResults = false
  myRec.onResult=parseResult;
  myRec.start();
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  //let dx = 160 - width / 2;
  //let dy = 105 - height / 2;
  //let v = createVector(-1 * dx, -1 * dy, 0);
  //v.div(100);
  //ambientLight(r, 0, b);
  //directionalLight(0, 200, b, v);
  //pointLight(0, g, 150, 200, 0, 0);
  background(0);
  noStroke();
  fill(255,0,0)
  textSize(size)
  if(pose){
    if(pose.rightWrist.confidence > 0.80 && pose.leftWrist.confidence > 0.80){
      diffLeft = Math.abs(pose.leftWrist.x -landmark[0]);
      diffRight =  Math.abs(pose.rightWrist.x-landmark[0]);
      totalDiff =  Math.abs(pose.leftWrist.x-pose.rightWrist.x)
      radius = map(diffLeft, 0, 200, 10, 400, true)
      tubeRadius = map(diffLeft, 0, 200, 10, 50, true)
      radius2 = map(diffRight, 0, 200, 10, 400, true)
      tubeRadius2 =  map(diffRight, 0, 200, 10, 50, true)
      prevLeftX = pose.leftWrist.x
      prevRightX = pose.rightWrist.x
      angleRate = map(diffLeft, 0, 200, 0, 0.10, true)
      angleRate2 = map(diffRight, 0, 200, 0, 0.10, true)
      size = map(diffLeft, 0, 200, 20, 120)
      textSize(size)
      fill(rgb(diffLeft))
      text(str(Math.trunc(diffLeft)), width/4 - size/2, height/2)
      size = map(diffRight, 0, 200, 20, 120)
      textSize(size)
      fill(rgb(diffRight))
      text(str(Math.trunc(diffRight)), width/4 * 3 - size/2, height/2)
      size = map(totalDiff, 0, 400, 20, 120)
      textSize(size)
      fill(rgb(totalDiff))
      text(str(Math.trunc(totalDiff)), width/2 - size/2, height/2)
    }
  }
  
}

function rgb(diff){
  g= 0
  if(diff > 50){
    r = map(diff, 50, 200, 0, 255)
  }
  else{
    r = 0
  }
  if(diff < 100)
  {
    b = map(diff, 0,100,255,0)
  }
  else{
    b = 0
  }
  return [r,g,b]
}

function parseResult(){
  mostrecentword = myRec.resultString;
  chunk = mostrecentword.split(" ")
  allSent = []
  for(i=0;i<chunk.length; i++){
    print(chunk[i])
    myWord = chunk[i].toUpperCase()
    print(myWord)
    try{
      allSent.push(sentiment.predict(myWord))
    }
    catch{
      print("No result for " + chunk[i])
    }
  }
  sum = 0
  allSent.forEach((item) => {
    sum += parseFloat(item['score'])
  });
  console.log(sum)
  console.log(allSent.length)
  avg = sum/allSent.length;
  console.log(avg)
  r = map(avg, 0.25, 0.75, 0, 255)
  g = map(avg, 0.25, 0.75, 100, 255)
  b = map(avg, 0.25, 0.75, 0, 100)

}