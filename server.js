const express = require("express");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const methodOverride = require("method-override");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const app = express();

const port = 5000;

const mongoDbURI = require("./config/keys");
mongoose
    .connect(mongoDbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log(err));


//requiring mongoose model

const Budget = require('./models/Budgets');
const { registerDecorator } = require("handlebars");


//template setup
app.engine(
    "handlebars",
    exphbs({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);
app.set("view engine", "handlebars");

//body parser setup

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//method overirde
app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    const greet = "Welcome to Budget Management";
    res.render('index', {
        greetMessage: greet
    });
})

app.use('/assets', express.static(__dirname + '/assets'));

app.get("/about", (req, res) => {

        res.render("about");
    })
    //add income
app.get("/calculator", (req, res) => {
    res.render("calculate")
});


app.get("/edit/passbook/:id", (req, res) => {
    Budget.findOne({ _id: req.params.id })
        .then((data) => {
            res.render("passbook", {
                budget: data,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});



app.get("/passbook", (req, res) => {

    Budget.find({}).then((data) => {
        //block scope
        let creditTotal = 0;
        let leftTotal = 0;
        let debitTotal = 0;
        let title;

        // let debitTotal=0;
        // here res will be in array
        data.forEach((value) => {
            title = value.title;
            if (value.type === "+") {
                creditTotal = creditTotal += value.amount;
                leftTotal = leftTotal += value.amount;
                //  console.log(creditTotal);
            }
            if (value.type === "-") {
                debitTotal = debitTotal -= value.amount;
                leftTotal = leftTotal -= value.amount;
                //  console.log(title);
            }

        })
        res.render("passbook", {
            title,
            debitTotal,
            creditTotal,
            leftTotal,
            budget: data,

        })

    });
});



//post method

app.post("/calculate", (req, res) => {

    const budgetAll = {
        title: req.body.title,
        amount: req.body.amount,
        type: req.body.type,

    };
    const budget = new Budget(budgetAll);
    budget
        .save()
        .then((data) => {
            res.redirect("/passbook")
        })
        .catch((err) => console.log(err));

});



//edit tasks @get
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

app.put("/passbook/:id", (req, res) => {
    Budget.findOne({ _id: req.params.id })
        .then((data) => {

            data.title = req.body.title;
            data.amount = req.body.amount;
            data
                .save()
                .then((data) => {
                    res.redirect("/passbook");
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
});


app.listen(port, () => {
    console.log(`port is running on ${port}`);
});