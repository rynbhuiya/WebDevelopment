var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;

function nextSequence() {
  // Change h1 text to current level
  level++;
  $("#level-title").text("Level " + level);

  userClickedPattern = [];
  // Find random color
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  // Flash random button with sound
  $("#" + randomChosenColor).fadeOut(100).fadeIn(100);

  var audio = new Audio('./sounds/' + randomChosenColor + '.mp3');
  audio.play();
}

// Find which button was pressed
var userChosenColor;
$(".btn").on("click", function() {
  userChosenColor = this.id;

  // Play audio for clicked button
  playSound(userChosenColor);

  // Add click animation
  animatePress(userChosenColor);

  userClickedPattern.push(userChosenColor);
  checkAnswer(userClickedPattern.length);
});


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

// Detect start of game
$(document).on("keypress", function(e) {
  if (level === 0) {
    nextSequence();
  }
});

// Check if answer is correct
function checkAnswer(idx) {
  if (gamePattern[idx-1] === userClickedPattern[idx-1]) {
    if (level === idx) {
      setTimeout(nextSequence, 1000);
    }
  }
  else {
    var wrongAudio = new Audio('./sounds/wrong.mp3');
    wrongAudio.play();

    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);

    $("#level-title").text("Game Over, Press Any Key to Restart");

    // Reset game
    startOver();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
}
