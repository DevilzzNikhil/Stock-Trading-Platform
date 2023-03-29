const express = require('express') ;
const router = express.Router() ;
const auth = require("../middleware/auth")
const {stockData, stockNames, stockTimedData} = require("../controllers/stockController") ;



router.get("/stocks-data", auth, stockData)
router.get("/stocks-name", auth, stockNames)
router.get("/stocksData", stockTimedData)

module.exports = router ;