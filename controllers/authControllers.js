const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID)


function PasswordValidator(password, res) {
    if (password.length < 6 || password.length > 25) {
        return true;
    }
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            return res.status(200).json({
                status: 400,
                message: "Credential not provided"
            })
        }
        if (PasswordValidator(password)) {
            return res.status(200).json({ status: 400, message: "Password must be between 6-25 characters" });
        }

        let existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(200).json({ status: 400, message: "Account Already with this email" });
        }

        existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(200).json({
                status: 400,
                message: "Username already exists"
            })
        }

        const user = await User.create({ email, username, password });
        const token = await user.generateAuthToken();
        res.status(200).json({ status: 200, message: "Registered Successfully", user, token });

    } catch (error) {
        res.status(200).json({ status: 400, message: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!password || !email) {
            return res.status(200).json({
                status: 400,
                message: "Credential not provided"
            })
        }
        const user = await User.findByCredentials(email, password);
        if (!user) {
            res.status(200).json({
                status: 400,
                message: "Incorrect Email or Password"
            })
        }

        const token = await user.generateAuthToken();
        res.status(200).json({ status: 200, message: "Logged In Successfully", user, token });

    } catch (error) {
        res.status(200).json({ status: 400, message: "Some Error Occured" })
    }
}

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const { email } = ticket.getPayload();
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(200).json({
                status: 400,
                message: "No user found with this email"
            })
        }
        const token_1 = await user.generateAuthToken();
        res.status(200).json({ status: 200, message: "Logged In Successfully", user, token_1 });


    } catch (error) {
        res.status(200).json({ status: 400, message: error.message })
    }
}





