const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")

const items = ["Buy food"]
const workItems = []

app.get("/", (req, res) => {
  let day = date.getDate()
  res.render("list", {
    listTitle: day,
    items: items
  })
})

app.post("/", (req, res) => {
  let item = req.body.newItem
  if (req.body.list === "Work") {
    workItems.push(item)
    res.redirect("/work")
  }
  else {
    items.push(item);
    res.redirect("/")
  }
})

app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work",
    items: workItems
  })
})

app.get("/about", (req, res) => {
  res.render("about")
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
})
