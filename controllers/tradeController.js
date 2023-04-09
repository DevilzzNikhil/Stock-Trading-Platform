const User = require("../models/userModel");
const Stock = require("../models/stocksModel");
const Transaction = require("../models/transactions");

exports.purchaseStock = async (req, res) => {
    try {
        const user = req.user;
        const { ticker, quantity, price } = req.body;
        if (!ticker || !quantity || !price) {
            return res.status(200).json({
                status: 400,
                message: "Credential not provided"
            })
        }
        const totalPrice = quantity * price;
        if (user.balance - totalPrice < 0) {
            return res.status(200).json({
                status: 400,
                message: "You don't have enough balance to purchase this stock."
            })
        }

        const purchased_stock = await Stock.find({ ticker: ticker, user: user._id })
        if (purchased_stock.length > 0) {
            let id = purchased_stock[0]._id;
            let new_price = parseInt(purchased_stock[0].price) + parseInt(quantity * price);
            let new_quantity = parseInt(purchased_stock[0].quantity) + parseInt(quantity);
            const stock = await Stock.findByIdAndUpdate(id, {
                price: new_price,
                quantity: new_quantity
            })
        }
        else {
            const purchase = new Stock({ ticker: ticker, quantity: quantity, price: price * quantity, user: user._id })
            req.user.stocks.push(purchase._id);
            await req.user.save();
            await purchase.save()
        }


        const transactionLog = new Transaction({
            userId: req.user._id,
            transactionType: "BUY",
            tickerBought: ticker,
            shares: quantity,
            investment: price
        });
        await transactionLog.save();

        await User.findByIdAndUpdate(user._id, {
            balance: Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100
        })



        return res.status(200).json({
            status: 200,
            message: "Transaction made successfully",
            balance: Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100,
        })

    } catch (error) {
        return res.status(200).json({
            status: 400,
            message: "Something unexpected happened.",
        });
    }
}


exports.sellStock = async (req, res) => {
    try {
        const user = req.user;
        const { ticker, quantity, price } = req.body;
        if (!ticker || !quantity || !price) {
            return res.status(200).json({
                status: 400,
                message: "Fill all the fields"
            })
        }

        const purchased_stock = await Stock.find({ ticker: ticker, user: user._id })

        if (purchased_stock.length == 0) {
            return res.status(200).json({
                status: 400,
                message: "You do not have enough quantity to sell the stock.",
            })
        }

        let present_quantity = purchased_stock[0].quantity;
        let present_price = purchased_stock[0].price;
        let avgPrice = present_price / present_quantity;
        let id = purchased_stock[0]._id;

        if (quantity > present_quantity) {
            return res.status(200).json({
                status: 400,
                message: "Invalid quantity.",
            });
        }

        if (quantity === present_quantity) {
            await Stock.findByIdAndDelete(id);
        }
        else {
            await Stock.findByIdAndUpdate(id, {
                quantity: present_quantity - quantity,
                price: present_price - quantity * avgPrice,
            });
        }

        let saleProfit = quantity * price;

        await User.findByIdAndUpdate(user._id, {
            balance: Math.round((user.balance + saleProfit + Number.EPSILON) * 100) / 100
        })

        const transactionLog = new Transaction({
            userId: req.user._id,
            transactionType: "SELL",
            tickerBought: ticker,
            shares: quantity,
            investment: price
        });
        await transactionLog.save();

        return res.status(200).json({
            status: 200,
            message: "Transaction made successfully",
            balance: Math.round((user.balance + saleProfit + Number.EPSILON) * 100) / 100,
        })
    } catch (error) {
        return res.status(200).json({
            status: 400,
            message: "Something unexpected happened.",
        });
    }
}