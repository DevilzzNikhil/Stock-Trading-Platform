const express = require("express");
const router = express.Router() ;
const {loginUser,registerUser, googleLogin} = require("../controllers/authControllers")

router.post("/register", registerUser) ;
router.post("/login", loginUser) 
router.post("/google-login", googleLogin) 


module.exports = router