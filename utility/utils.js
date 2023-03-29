const fs = require("fs") ;
const parse = require("csv-parse")


fs.readFile("../static/Stock.csv", "utf-8", (err,data) => {
    if(err) console.log(err) ;
    else console.log(data) ;
})