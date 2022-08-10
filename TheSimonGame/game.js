buttonColors = ["red", "blue", "green", "yellow"];
gamePattern = [];
userClickedPattern = [];

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  return randomNumber;
}

var randomChosenColor = buttonColors[nextSequence()];
gamePattern.push(randomChosenColor);

// Flash random button with sound
console.log(randomChosenColor)
$("#" + randomChosenColor).fadeOut(100).fadeIn(100);

var audio = new Audio('./sounds/' + randomChosenColor + '.mp3');
audio.play();

// Find which button was pressed
var userChosenColor;
$(".btn").on("click", function() {
  userChosenColor = this.id;
  console.log("user chosen color: " + userChosenColor);

  // Play audio for clicked button
  playSound(userChosenColor);

  // Add click animation
  animatePress(userChosenColor);

  userClickedPattern.push(userChosenColor);
  console.log(userClickedPattern);
})


function playSound(name) {
  var audio = new Audio('./sounds/' + name + '.mp3');
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}
