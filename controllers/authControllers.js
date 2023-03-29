const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


function PasswordValidator(password, res) {
    if (password.length < 6 || password.length > 25) {
        return true;
    }
}

function ErrorMessage(res, error) {
    return res.status(error.status).json({ message: error.message });
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !password || !email) {
            return res.status(200).json({
                status: "Failed",
                message: "Fill all the fields"
            })
        }
        if( PasswordValidator(password) )
        {
            return res.status(200).json({
                status: "Failed",
                message: "Password must be between 6-25 characters",
            });
        }

        let existingUser = await User.findOne({email}) 
        if(existingUser)
        {
            return res.status(200).json({
                status: "Failed",
                message: "Account Already Exist with this Email",
            });
        }

        existingUser = await User.findOne({username}) 
        if(existingUser)
        {
            return res.status(200).json({
                status: "Failed",
                message: "Account Already Exist with this Username",
            });
        }

        const user = await User.create({ email, username, password });
        const token = await user.generateAuthToken() ;
        return res.status(201).json({ message:"Registered Successfully Successfully", user, token});

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!password || !email) {
            return res.status(200).json({
                status: "Failed",
                message: "Credential not provided"
            })
        }
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.json({ message:"Logged In Successfully", user, token });

    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token;
        })
    } catch (error) {
        res.status(400).json(error.message)
    }
}





