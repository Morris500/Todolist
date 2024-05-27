const express = require('express');
const bodyparser = require('body-parser');
const dat = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const app = express();
const port = 4000

// var items = ["Buy food","cook Food","Eat Food"];
// var workitems = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

const url = 'mongodb://localhost:27017/ITEMSDB';

mongoose.connect(url, {})
.then((result) => console.log('successfully connected'))
.catch((err) => console.log(err));


const Itemschema = new schema ({
  name : String,
  tittle : String
});


const Item = mongoose.model("Item", Itemschema)

const item1 = new Item ({
  name: "Buy food"
});

const item2 = new Item ({
  name: "Cook food"
});

const item3 = new Item ({
  name: "Buy drink"
});

const defaultItem = [item1, item2, item3]

const Customitem = mongoose.model("Customitem", Itemschema)

// Item.insertMany(defaultItem)
// .then((result) => console.log("sucessfully uploaded"))
// .catch((err) => console.log(err));
let day = dat.getdate();

app.get("/", function (req, res) {
let day = dat.getdate();
console.log(day);
Item.find()
.then((result) => {let data = result; 
if (data.length === 0) {
 Item.insertMany(defaultItem)
.then((result) => console.log("sucessfully uploaded"))
.catch((err) => console.log(err));
res.redirect("/");
} else {
  res.render("list",{listTittle: day, newitem: data});
}
  
})
.catch((err) => console.log(err));

});

app.get("/:customitem", function (req, res) {
  const customitems = req.params.customitem

 Customitem.find({tittle: customitems}, {name : 1}).then((result) => {res.render("list", {listTittle: customitems, newitem: result})
 console.log(result)})
 .catch((err) => console.log(err)) 

});

app.post("/", function (req, res) {
 let listname = req.body.button
 console.log(listname);

  const item4 = new Item ({
    name:  req.body.addItem,
    tittle: req.body.button
  });
 item = req.body.addItem;
 if (listname === day) {
  Item.insertMany(item4);
  res.redirect("/");
 } else {
  Customitem.insertMany(item4);
  res.redirect("/" + listname);
 }

//console.log(item4);
});

app.post ("/delete", (req, res) => {
const check = req.body.checkbox
const deletecustom = req.body.deleteitem
console.log(check);
if (deletecustom === day) {

  Item.findByIdAndDelete(check).then((result) => {console.log("deleted sucessfully")})
.catch((err) => console.log(err))

res.redirect("/")

} else {

Customitem.findByIdAndDelete(check).then((result) => {console.log("delete")})
.catch((err) => console.log(err))
res.redirect("/"+deletecustom)
  }

})


app.listen(port, function() {
  console.log("server is running on port " + port);
});
