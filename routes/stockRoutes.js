const express = require('express') ;
const router = express.Router() ;
const auth = require("../middleware/auth")
const {stockData, stockNames, stockTimedData,  portfolioData} = require("../controllers/stockController") ;



router.get("/stocks-data", auth, stockData)
router.get("/stocks-name", auth, stockNames)
router.get("/stocksData", auth, stockTimedData)
router.get("/user-portfolio", auth, portfolioData)

module.exports = router ;