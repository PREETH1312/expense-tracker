const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({

    tripName: {
        type: String,
        required: true
    },

    members: {
        type: Number,
        required: true
    },

    expenses: [

        {
            title: String,
            amount: Number
        }

    ],

    total: {
        type: Number,
        default: 0
    },

    split: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model("Trip", tripSchema);