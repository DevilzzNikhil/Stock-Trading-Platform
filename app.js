require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express') 

const authRouter = require('./routes/authRoutes')
const stockRouter = require("./routes/stockRoutes") ;
const tradeRouter = require("./routes/tradeRoutes") ;


const DB = process.env.DB

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())


app.get("/", (req, res) => {
    res.send("HELLO Home Page")
})

app.use('/auth', authRouter) ;
app.use("/stock", stockRouter) ;
app.use('/trade', tradeRouter) ;



const PORT = process.env.PORT || 5000

mongoose
    .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    })
    .catch((err) => {
        console.log(err)
    })








