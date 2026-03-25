const express = require("express");
const mongoose = require("mongoose");
const Expense = require("./models/Expense");
const Trip = require("./models/Trip");   // IMPORTANT

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/expenseDB")
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");  // place here (recommended)


// ---------------- NORMAL EXPENSE ROUTES ----------------

app.get("/", (req, res) => {
    res.redirect("/expenses");
});

app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find();
    res.render("expenses", { expenses });
});

app.get("/add", (req, res) => {
    res.render("add");
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

    await newExpense.save();

    res.redirect("/expenses");
});

app.get("/edit/:id", async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    res.render("edit", { expense });
});

app.post("/edit/:id", async (req, res) => {

    const { title, amount, members, category } = req.body;

    const split = amount / members;   // calculate again

    await Expense.findByIdAndUpdate(req.params.id, {
        title,
        amount,
        members,
        split,
        category
    });

    res.redirect("/expenses");
});

app.post("/delete/:id", async (req, res) => {

    await Expense.findByIdAndDelete(req.params.id);

    res.redirect("/expenses");

});


// ---------------- GROUP TRIP ROUTES ----------------

// create trip page
app.get("/trip/new", (req, res) => {
    res.render("trip_new");
});

// save trip
app.post("/trip/new", async (req, res) => {

    const { tripName, members } = req.body;

    const newTrip = new Trip({

        tripName,
        members,
        expenses: []

    });

    await newTrip.save();

    res.redirect("/trip/" + newTrip._id);

});

// show trip
app.get("/trip/:id", async (req, res) => {

    const trip = await Trip.findById(req.params.id);

    res.render("trip_detail", { trip });

});

// add expense to trip
app.post("/trip/:id/add-expense", async (req, res) => {

    const { title, amount } = req.body;

    const trip = await Trip.findById(req.params.id);

    trip.expenses.push({
        title,
        amount
    });

    trip.total = trip.expenses.reduce(

        (sum, e) => sum + Number(e.amount),

        0

    );

    trip.split = trip.total / trip.members;

    await trip.save();

    res.redirect("/trip/" + req.params.id);

});


// ---------------- SERVER ----------------

app.get("/test-trip", (req,res)=>{
    res.send("Trip route working");
});

app.listen(3000, () => {

    console.log("Server started on port 3000");

});