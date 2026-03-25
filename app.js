const express = require("express");
const mongoose = require("mongoose");
const Expense = require("./models/Expense");

const app = express();

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/expenseDB")
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect("/expenses");
});

app.get("/add-test", async (req, res) => {

    const split = 100 / 5;

    const newExpense = new Expense({

        title: "Test Expense",
        amount: 100,
        members: 5,
        split,
        category: "Test"

    });

    await newExpense.save();

    res.send("Test data saved ✅");
});


app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find();
    res.render("expenses", { expenses });
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.get("/edit/:id", async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    res.render("edit", { expense });
});

app.post("/add", async (req, res) => {

    const { title, amount, category, members } = req.body;

    const split = amount / members;

    const newExpense = new Expense({

        title,
        amount,
        members,
        split,
        category

    });
    console.log(split);

    await newExpense.save();

    res.redirect("/expenses");

});

app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;

    await Expense.findByIdAndDelete(id);

    res.redirect("/expenses");
});

app.post("/edit/:id", async (req, res) => {
    const { title, amount, members, category } = req.body;

    await Expense.findByIdAndUpdate(req.params.id, {
        title,
        amount,
        members,
        split,
        category
    });

    res.redirect("/expenses");
});


app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server started on port 3000");
});



