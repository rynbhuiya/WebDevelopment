const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.get("/bmicalculator", (req, res) => {
  res.sendFile(__dirname + "/bmiCalculator.html")
})

app.post("/", function(req, res){
  var num1 = Number(req.body.num1)
  var num2 = Number(req.body.num2)

  res.send(num1 + num2)
})

app.post("/bmicalculator", function(req, res){
  var w = parseFloat(req.body.weight)
  var h = parseFloat(req.body.height)

  res.send("Your BMI is: " + (w / (h * h)))
})

app.listen(3000, () => {
  console.log('Listening to port 3000')
})
