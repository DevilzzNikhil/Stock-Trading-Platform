const User = require("../models/userModel");
const Stock = require("../models/stocksModel");

exports.purchaseStock = async (req, res) => {
    try {
        const user = req.user;
        const { ticker, quantity, price } = req.body;
        if (!ticker || !quantity || !price) {
            return res.status(200).json({
                status: "Failed",
                message: "Fill all the fields"
            })
        }
        const totalPrice = quantity * price;
        if (user.balance - totalPrice < 0) {
            return res.status(200).json({
                status: "Transaction Failed",
                message: "You don't have enough balance to purchase this stock.",
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
            await purchase.save()
        }

        await User.findByIdAndUpdate(user._id, {
            balance: Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100
        })

        return res.status(200).json({
            status: "Transaction made successfully",
            balance: Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100,
        })

    } catch (error) {
        return res.status(200).json({
            status: "fail",
            message: "Something unexpected happened.",
            error: error.message
        });
    }
}


exports.sellStock = async (req, res) => {
    try {
        const user = req.user;
        const { ticker, quantity, price } = req.body;
        if (!ticker || !quantity || !price) {
            return res.status(200).json({
                status: "Failed",
                message: "Fill all the fields"
            })
        }

        const purchased_stock = await Stock.find({ ticker: ticker, user: user._id })

        if (purchased_stock.length == 0) {
            return res.status(200).json({
                status: "Transaction Failed",
                message: "You does'not have enough quantity to sell the stock.",
            })
        }

        let present_quantity = purchased_stock[0].quantity;
        let present_price = purchased_stock[0].price;
        let avgPrice = present_price / present_quantity;
        let id = purchased_stock[0]._id;

        if (quantity > present_quantity) {
            return res.status(200).json({
                status: "fail",
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

        return res.status(200).json({
            status: "Transaction made successfully",
            balance: Math.round((user.balance + saleProfit + Number.EPSILON) * 100) / 100,
        })
    } catch (error) {
        return res.status(200).json({
            status: "fail",
            message: "Something unexpected happened.",
            error: error.message
        });
    }
}