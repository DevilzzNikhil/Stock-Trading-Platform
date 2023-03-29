const User = require("../models/userModel")
const stockNames = require("../assets/Names.json")

const {getStockInformation, getTimedVariedData} = require("../utility/stocksInfo")

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