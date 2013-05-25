

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
  this.speed = 5;
  this.draw = function(context){
      //Make our little friend gradient-y
      var my_gradient = context.createLinearGradient(0, 0, 300, 225);
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
}


var canvas = document.getElementById('canvas');

var player = new kirby();

function render(){

}

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
    
    //place kirby down
    player.draw(context);

  }
}