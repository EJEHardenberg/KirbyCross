

//Firing events has never been easier
function fireEvent(name, target) {
    //Ready: create a generic event
    var evt = document.createEvent("Events")
    //Aim: initialize it to be the event we want
    evt.initEvent(name, true, true); //true for can bubble, true for cancelable
    //Fire the event
    target.dispatchEvent(evt);
}


function kirby(){
  this.x = 25;   this.y = 200; //Starts at midway
  this.width = 20;
  this.height = 20;
  this.speed = 3;
  this.draw = function(context){
      //Make our little friend gradient-y
      var my_gradient = context.createLinearGradient(this.x-this.width, this.y-this.height, this.x + this.width, this.y+this.height);
      my_gradient.addColorStop(0, "pink");
      my_gradient.addColorStop(1, "purple");
      context.fillStyle = my_gradient;
      //Actually draw and fill
      context.beginPath();
      context.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false); 
      context.fill();
      context.closePath();
      context.stroke();
  }
  this.moveRight = function(){
    this.x = this.x < 20 ? 20 : (this.x > 380 ? 380 : this.x += this.speed);
  }
  this.moveLeft = function(){
    this.x = this.x < 20 ? 20 : (this.x > 380 ? 380 : this.x -= this.speed);
  }
  this.moveUp = function(){
    this.y = this.y < 20 ? 20 : (this.y > 380 ? 380 : this.y -= this.speed);
  }
  this.moveDown = function(){
    this.y = this.y < 20 ? 20 : (this.y > 380 ? 380 : this.y += this.speed);
  }
  this.collide = function(otherObject){
    //Calculate current boundaries
    var xright = this.x + this.width;
    var xleft = this.x - this.width;
    var ytop = this.y - this.height;
    var ybottom = this.y + this.height;
    //Calculate other things boundaries
    var oright = otherObject.x + otherObject.width;
    var oleft = otherObject.x - otherObject.width;
    var otop = otherObject.y - otherObject.height;
    var obottom = otherObject.y + otherObject.height;

    //For explanation of the boolean below, see my blog
    //http://ethaneldridgecs.blogspot.com/2012/11/kd-tree-range-bounded-algorithm.html
    //modified slighlty because js coordinates are from the top left as origin
    return  !(xright < oleft) && !(oright < xleft) && !(otop > ybottom) && !(ytop > obottom );
  }
}

function star(sx,sy){
  this.x = sx;   this.y = sy; //Starts at midway
  this.width = 30;
  this.height = 30;
  this.speed = 6;
  this.draw = function(context){
      //Make our little friend gradient-y
      context.fillStyle = "#fff000";
      //Actually draw and fill
      //start at top point
      var pointX = 0;
      var pointY = this.height;
      var bottomRightX = this.width/4;
      var bottomRightY = 0;
      var bottomLeftX = -this.width/4;
      var bottomLeftY = 0;

      //transformation matrix
      var transMat = [[],[]];

      context.moveTo(this.x+ pointX,this.y - pointY);
      context.lineTo(this.x+bottomRightX,this.y+bottomRightY);
      context.lineTo(this.x-bottomLeftX,this.y+bottomLeftY);
      context.lineTo(this.x+pointX,this.y-pointY);

      //Translate the points around 72 degrees each time
      for(var d = 72; d <= 360; d += 72){
        transMat = [[Math.cos(d* Math.PI/180),Math.sin(d* Math.PI/180)],[-Math.sin(d* Math.PI/180),Math.cos(d* Math.PI/180)]];
        var newPointX = transMat[0][0]*pointX + transMat[0][1]*pointY;
        var newPointY = transMat[1][0]*pointX + transMat[1][1]*pointY;
        var newBottomLeftX = transMat[0][0]*bottomLeftX + transMat[0][1]*bottomLeftY;
        var newBottomLeftY = transMat[1][0]*bottomLeftX + transMat[1][1]*bottomLeftY;
        var newBottomRightX = transMat[0][0]*bottomRightX + transMat[0][1]*bottomRightY;
        var newBottomRightY = transMat[1][0]*bottomRightX + transMat[1][1]*bottomRightY;
  
        //Draw
        context.moveTo(this.x+ newPointX,this.y - newPointY);
        context.lineTo(this.x+newBottomRightX,this.y+newBottomRightY);
        context.lineTo(this.x+newBottomLeftX,this.y+newBottomLeftY);
        context.lineTo(this.x+newPointX,this.y-newPointY);
        context.fill();
        //Rect(this.x-this.width,this.y-this.height,this.x + this.width,this.y + this.height);
      }

      


      //context.fill();
      
      context.stroke();
  }
  this.moveDown = function(){
    //Create a loop by sending a star back
    this.y = this.y > 380 ? -60 : this.y += this.speed;
  }
  this.collide = function(otherObject){
    //Calculate current boundaries
    var xright = this.x + this.width;
    var xleft = this.x - this.width;
    var ytop = this.y - this.height;
    var ybottom = this.y + this.height;
    //Calculate other things boundaries
    var oright = otherObject.x + otherObject.width;
    var oleft = otherObject.x - otherObject.width;
    var otop = otherObject.y - otherObject.height;
    var obottom = otherObject.y + otherObject.height;

    //For explanation of the boolean below, see my blog
    //http://ethaneldridgecs.blogspot.com/2012/11/kd-tree-range-bounded-algorithm.html
    //modified slighlty because js coordinates are from the top left as origin
    return  !(xright < oleft) && !(oright < xleft) && !(otop > ybottom) && !(ytop > obottom );
  }
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeStars(){
  var xs = [120,200,280];
  var ys = [];
  tmp =[];
  for(var i =0; i < 7; i++){
    ys.push(getRandomInt(-60,360));
  }
  for(var i=0; i < 7; i++){
    tmp.push(new star(xs[getRandomInt(0,2)],ys[i]));
  }
  return tmp;
}

var canvas = document.getElementById('canvas');

var player = new kirby();

var stars = makeStars();//[new star(120,0), new star(200,-30),new star(280,-100)];

var lives = parseInt(document.getElementById('lives').innerHTML);
var wins = parseInt(document.getElementById('wins').innerHTML);


function render(){
  //Make sure we got it
  if (canvas && canvas.getContext) {
    // Get the 2d context of the canvas --only one per canvas
    var context = canvas.getContext('2d');
    var cWidth = canvas.width;
    var cHeight = canvas.height;

    if (context) {
      //Draw Background of Canvas
      context.fillStyle = '#aaaaaa';
      context.fillRect(0, 0, cWidth, cHeight);

      //Switch back to black for writing text
      context.fillStyle = '000';
      context.font = 'bold 100% sans-serif ';
      
      //Draw 'road'
      for(var x = 80; x < 400; x+= 80){
          context.moveTo(x,0);
          context.lineTo(x,400);
          //Make the line doubly thick
          context.moveTo(x+1,0);
          context.lineTo(x+1,400);
          context.strokeStyle = "#000000";
          context.stroke();
      }
      
     

      //Place down any stars going by
      for(var s = 0; s < stars.length; s++){
        stars[s].moveDown();
        stars[s].draw(context);
        //Check for collisions -done while drawing for optimization purposes (no need for another loop to check I mean)
        if(player.collide(stars[s])){
          fireEvent('death',document)
        }
      }

      //place kirby down
      player.draw(context);   

      //Check for win
      if(player.x > 320 + player.width){
        wins += 1;
        document.getElementById('wins').innerHTML = wins;
        player = new kirby();
      }

    }
  }
}

//Bindings:
document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch (evt.keyCode) {
      case 37: //left
        player.moveLeft();
        break;
      case 38: //up
        player.moveUp();
        break;
      case 39: //right
        player.moveRight();
        break;
      case 40: //downonclick
        player.moveDown();
        break;
  }
}

render();

var animating = window.setInterval(render,100);

function reset(){
  console.log("death");
  lives = lives -1;
  document.getElementById('lives').innerHTML = lives;
  player = new kirby();

  if(lives <= 0){
    //Game Over man stop the animation
    clearInterval(animating);
    //Do whatever there is to do to allow the player to start up a new game
  }
}

//Bind the event for catching death of kirby
window.addEventListener("death", reset, false); //false to get it in bubble not capture. (https://developer.mozilla.org/en-US/docs/DOM/EventTarget.addEventListener)

//Bind the event for resetting the game:
document.getElementById('reset').onclick = function(){
  lives = 5;
  wins = 0;
  document.getElementById('lives').innerHTML = lives;
  document.getElementById('wins').innerHTML = wins;
  clearInterval(animating);
  animating = window.setInterval(render,100);
  player = new kirby();

};