const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/auth")
const {loginUser,registerUser, googleLogin, infoUser} = require("../controllers/authControllers")

router.post("/register", registerUser) ;
router.post("/login", loginUser) 
router.post("/google-login", googleLogin) 
router.get("/info", auth, infoUser)


module.exports = router