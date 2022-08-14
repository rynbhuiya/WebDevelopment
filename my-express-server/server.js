const express = require('express');
const app = express();

// Send response to get request to home route
app.get("/", function(req, res) {
  res.send("<h1>Hello</h1>")
});

app.get("/contact", function(req, res){
  res.send("Contact me at : email.com");
});

app.get("/about", function(req, res) {
  res.send("This website is owned by me");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
