const User = require("../models/userModel")
const stockNames = require("../assets/Names.json")
const Stock = require("../models/stocksModel")

const {getStockInformation, getTimedVariedData} = require("../utility/stocksInfo")
const ObjectId = require("mongoose").Types.ObjectId ;

exports.stockData = async (req,res) => {
    const data = await getStockInformation() ;
    return res.status(200).json({data});
}

exports.stockNames = async(req,res) => {
    const data = stockNames ;
    return res.status(200).json({data})
}

exports.stockTimedData = async(req,res) => {
    let timeDuration = "Weekely" ;
    let symbol = "IBM" ; 
    let interval = "5min"

    if(req.query.symbol) symbol = req.query.symbol
    if( req.query.timeDuration) timeDuration = req.query.timeDuration
    if( req.query.interval) interval = req.query.interval

    data = await getTimedVariedData(timeDuration, symbol, interval) ;
    
    return res.status(200).json({message : "success", data : data})
}

exports.portfolioData = async(req,res) => {
    const user = req.user  ; 
    const id = user._id ;
    console.log(user) ;
    User.findById(user._id).populate('stocks').then(({ stocks }) => {
        res.status(200).json(stocks)
    })

}