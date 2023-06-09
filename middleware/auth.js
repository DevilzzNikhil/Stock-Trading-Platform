const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const authUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'appSecret');
        const user = await User.findOne({
            _id: decode._id,
        })
        if (!user) throw new Error("Please Authenticate")
        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({ error: error.message })
    }
}

module.exports = authUser ;