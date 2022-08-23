const express = require("express")
const app = express();
const https = require("https")
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res) {
  const query = req.body.cityName
  const apiKey = "7a5c054b6101582fe6f3392959d70a15"
  const unit = "imperial"
  const url = "https://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&q=" + query + "&units=" + unit
  https.get(url, function(response) {
    console.log(response)

    response.on("data", function(data) {
      const weatherData = JSON.parse(data)
      const temp = weatherData.main.temp
      const weatherDesc = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      res.write("<p>The weather is " + weatherDesc + ".</p>")
      res.write("<h1>The temperature in " + query + " is " + temp + " farenheit.</h1>")
      res.write('<img src="' + imgURL + '">')
      res.send()
    })
  })
})

app.listen(3000, function() {
  console.log("Server is running on Port 3000")
})
