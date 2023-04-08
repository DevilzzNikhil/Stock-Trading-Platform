const express = require('express') ;
const router = express.Router() ;
const auth = require("../middleware/auth")
const {stockData, stockNames, stockTimedData,  portfolioData, stockInfo, leaderBoard, getAllTransaction} = require("../controllers/stockController") ;



router.get("/stocks-data", auth, stockData)
router.get("/stock-info", auth, stockInfo)
router.get("/stocksData", auth, stockTimedData)
router.get("/user-portfolio", auth, portfolioData)
router.get("/leader-board", auth, leaderBoard)
router.get("/allTransaction", auth, getAllTransaction )

module.exports = router ;