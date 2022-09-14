//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb+srv://admin-rb:zooman12@cluster0.3lktyu9.mongodb.net/todolistDB")

const itemsSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("item", itemsSchema)

const item1 = new Item({
  name: "Buy Food"
})

const item2 = new Item({
  name: "Cook Food"
})

const item3 = new Item({
  name: "Eat Food"
})

const defaultItems = [item1, item2, item3]

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const List = mongoose.model("list", listSchema)

// Get Functions
app.get("/", function(req, res) {

  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Successfully saved default list to MongoDB");
        }
      })
    }

    res.render("list", {listTitle: "Today", newListItems: items});
  })
});

app.get("/:listName", (req, res) => {
  const customListName = _.capitalize(req.params.listName)

  List.findOne({name: customListName}, (err, ret) => {
    if (!err) {
      if (!ret) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        })

        list.save()
        res.render("list", {listTitle: customListName, newListItems: list.items})
      }
      else {
        // Show existing list
        res.render("list", {listTitle: ret.name, newListItems: ret.items})
      }
    }
  })
})


// Post Functions
app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item  = new Item({
    name: itemName
  })

  if (listName === "Today") {
    item.save()
    res.redirect("/")
  }
  else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item)
      foundList.save()
      res.redirect("/" + listName)
    })
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, err => {
      if (!err) {
        console.log("Successfully removed item");
        res.redirect("/")
      }
    })
  }
  else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName)
      }
    })
  }
})



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
