const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const stockSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ticker:{
        type: String,
        required: true ,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

const Stock = mongoose.model("Stock", stockSchema) ;

module.exports = Stock ;