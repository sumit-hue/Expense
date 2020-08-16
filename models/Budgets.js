const mongoose = require('mongoose')

const Schema = mongoose.Schema

const budgetSchema = Schema({
    title: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        reuired: true,
    },

    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Budget = mongoose.model('budget', budgetSchema)