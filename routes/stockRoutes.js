const express = require('express') ;
const router = express.Router() ;
const auth = require("../middleware/auth")
const {stockData, stockNames, stockTimedData,  portfolioData, stockInfo} = require("../controllers/stockController") ;



router.get("/stocks-data", auth, stockData)
router.get("/stock-info", auth, stockInfo)
router.get("/stocksData", auth, stockTimedData)
router.get("/user-portfolio", auth, portfolioData)

module.exports = router ;