const Transaction = require("../models/transactions");
const User = require("../models/userModel")

const { getStockInformation, getTimedVariedData, getInfoOfOneStock } = require("../utility/stocksInfo")
const ObjectId = require("mongoose").Types.ObjectId;

exports.stockData = async (req, res) => {
    const data = await getStockInformation();
    return res.status(200).json({ data });
}

exports.stockInfo = async (req, res) => {
    const symbol = req.query.symbol;
    const res_data = await getInfoOfOneStock(symbol);
    res.status(200).json({ res_data });
}

exports.stockTimedData = async (req, res) => {
    let timeDuration = "Weekely";
    let symbol = "IBM";
    let interval = "5min"

    if (req.query.symbol) symbol = req.query.symbol
    if (req.query.timeDuration) timeDuration = req.query.timeDuration
    if (req.query.interval) interval = req.query.interval

    data = await getTimedVariedData(timeDuration, symbol, interval);

    return res.status(200).json({ message: "success", data: data })
}

exports.portfolioData = async (req, res) => {
    const user = req.user;
    const id = user._id;
    User.findById(user._id).populate('stocks').then(({ stocks }) => {
        res.status(200).json(stocks)
    })

}

exports.leaderBoard = async (req, res) => {
    let users = await User.find();
    let list = [];
    users.forEach(element => {
        let userData = {
            username: element.username,
            balance: element.balance,
        }
        list.push(userData);
    });

    list.sort((a, b) => {
        return b.balance - a.balance
    })

    res.status(200).json(list)
}


exports.getAllTransaction = async (req, res) => {
    const user = req.user;
    const id = user._id;
    try {
        const allTransactions = await Transaction.find({ userId: id }).sort({ transactedAt: -1 });
        res.status(200).json(allTransactions);
    } catch (error) {
        res.status(404).json({ message: "An error has occurred fetching your transactions." });
    }
}


