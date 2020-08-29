"use strict";

var express = require("express");

var exphbs = require('express-handlebars');

var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var Handlebars = require("handlebars");

var methodOverride = require("method-override");

var _require = require('@handlebars/allow-prototype-access'),
    allowInsecurePrototypeAccess = _require.allowInsecurePrototypeAccess;

var app = express();
var port = 5000;

var mongoDbURI = require("./config/keys");

mongoose.connect(mongoDbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("mongodb connected");
})["catch"](function (err) {
  return console.log(err);
}); //requiring mongoose model

var Budget = require('./models/Budgets');

var _require2 = require("handlebars"),
    registerDecorator = _require2.registerDecorator; //template setup


app.engine("handlebars", exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars"); //body parser setup
// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({
  extended: false
})); // parse application/json

app.use(bodyParser.json()); //method overirde

app.use(methodOverride("_method"));
app.get('/', function (req, res) {
  var greet = "Welcome to Budget Management";
  res.render('index', {
    greetMessage: greet
  });
});
app.use('/assets', express["static"](__dirname + '/assets'));
app.get("/about", function (req, res) {
  res.render("about");
}); //add income

app.get("/calculator", function (req, res) {
  res.render("calculate");
});
app.get("/edit/passbook/:id", function (req, res) {
  Budget.findOne({
    _id: req.params.id
  }).then(function (data) {
    res.render("passbook", {
      budget: data
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
app.get("/passbook", function (req, res) {
  Budget.find({}).then(function (data) {
    //block scope
    var creditTotal = 0;
    var leftTotal = 0;
    var debitTotal = 0;
    var title; // let debitTotal=0;
    // here res will be in array

    data.forEach(function (value) {
      title = value.title;

      if (value.type === "+") {
        creditTotal = creditTotal += value.amount;
        leftTotal = leftTotal += value.amount; //  console.log(creditTotal);
      }

      if (value.type === "-") {
        debitTotal = debitTotal -= value.amount;
        leftTotal = leftTotal -= value.amount; //  console.log(title);
      }
    });
    res.render("passbook", {
      title: title,
      debitTotal: debitTotal,
      creditTotal: creditTotal,
      leftTotal: leftTotal,
      budget: data
    });
  });
}); //post method

app.post("/calculate", function (req, res) {
  var budgetAll = {
    title: req.body.title,
    amount: req.body.amount,
    type: req.body.type
  };
  var budget = new Budget(budgetAll);
  budget.save().then(function (data) {
    res.redirect("/passbook");
  })["catch"](function (err) {
    return console.log(err);
  });
}); //edit tasks @get
// app.get("/edit/passbook/:id",(req,res) =>{
//   Budget.findOne({ _id: req.params.id })
//     .then((data) => {
//       res.render("edit", {
//       budget:data
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.put("/passbook/:id", function (req, res) {
  Budget.findOne({
    _id: req.params.id
  }).then(function (data) {
    data.title = req.body.title;
    data.amount = req.body.amount;
    data.save().then(function (data) {
      res.redirect("/passbook");
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
app.listen(port, function () {
  console.log("port is running on ".concat(port));
});