$("h1").addClass("big-title");

// Add click event listener to h1
$("h1").click(function () {
  $("h1").css("color", "purple");
});

// Add click event listener to all buttons
$("button").click(function() {
  $("h1").css("color", "purple");
})

// Add keypress event listener
$("input").keypress(function(e) {
  console.log(e.key);
})

// Add click event listener to document
$(document).keypress(function(e) {
  $("h1").text(e.key);
})


// More flexibile way for event listener
$("h1").on("mouseover", function() {
  $("h1").css("color", "green");
})
