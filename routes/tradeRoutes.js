const express = require("express")
const router = express.Router() ;
const auth = require("../middleware/auth")
const {purchaseStock, sellStock} = require("../controllers/tradeController")


router.post("/purchase-stock", auth, purchaseStock) ;
router.post("/sell-stock", auth, sellStock) ;

module.exports = router ;