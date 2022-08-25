const express = require("express");
const request = require('request');
const https = require("https");
const bodyParser = require("body-parser");
const client = require("mailchimp-marketing");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: "2c5a7e372a429f162d3b5c1be399e9e6-us12",
  server: "us12"
});

app.post("/", (req, res) => {
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email

  console.log(firstName, lastName, email);

  const run = async () => {
    const response = await client.lists.addListMember("e6e5c8ce27", {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    })
    res.sendFile(__dirname + "/success.html")
  }



  run().catch(e => {
    console.log(e);
    res.sendFile(__dirname + "/failure.html")
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on Port 3000")
})


app.post("/failure", (req, res) => {
  res.redirect("/")
})
