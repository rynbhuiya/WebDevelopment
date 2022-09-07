const mongoose = require("mongoose")

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect("mongodb://localhost:27017/fruitsDB")

  const fruitSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    review: String
  })

  const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favFruit: fruitSchema
  })

  const Fruit = mongoose.model("fruit", fruitSchema)

  const fruit = new Fruit({
    name: "Apple",
    rating: 7,
    review: "Pretty solid as a fruit"
  })

  //fruit.save()

  const Person = new mongoose.model("person", personSchema)

  const person = new Person({
    name: "Johan",
    age: 21,
    favFruit: fruit
  })

  person.save()
  // const banana = new Fruit({
  //   name: "Banana",
  //   rating: 10,
  //   review: "Best fruit created"
  // })
  //
  // const kiwi = new Fruit({
  //   name: "Kiwi",
  //   rating: 9,
  //   review: "Sweet"
  // })

  // Fruit.insertMany([banana, kiwi], err => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log("Fruits successfully added");
  //   }
  // })

  Fruit.find((err, fruits) => {
    if (err) {
      console.log(err);
    }
    else {
      mongoose.connection.close()

      fruits.forEach(fruit => {
        console.log(fruit.name);
      })
    }
  })

}
