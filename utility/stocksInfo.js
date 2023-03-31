const axios = require("axios");
require("dotenv").config();


async function getInfoOfOneStock(symbol) {
    let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.API_KEY}`

    let data ;
    let option = {
        method: "GET",
        url: url,
        headers: { 'User-Agent': 'request' },
    }
    await axios.request(option).then(function (response) {
        data = response.data;
    })
    let new_data ; 
    Object.keys(data).map((key)=> {
        new_data = data[key]
    })
    return new_data 
}

async function getStockInformation() {
    let data = [];
    // let stockNames = [];
    const options = {
        method: 'GET',
        url: 'https://latest-stock-price.p.rapidapi.com/price',
        params: { Indices: 'NIFTY 100' },
        headers: {
            'X-RapidAPI-Key': '2672419d46mshaba07eccc62d511p1a4ae8jsn56866a8d9340',
            'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
        }
    };

    await axios.request(options).then(function (response) {
        data = response.data;
    }).catch(function (error) {
        console.error(error);
    });
    let formattedData = [];
    data.map((stock) => {

        // stockNames.push({
        //     name: stock.identifier,
        //     symbol: stock.symbol,
        // })
        formattedData.push({
            name: stock.identifier,
            symbol: stock.symbol,
            open: stock.open,
            dayHigh: stock.dayHigh,
            dayLow: stock.dayLow,
            previousClose: stock.previousClose,
            change: stock.change,
            pChange: stock.pChange,
        })
    })
    // var stocks = JSON.stringify(stockNames);
    // fs.writeFile("Names.json", stocks, function (err, result) {
    //     if (err) console.log('error', err);
    // });
    return formattedData
}



async function getTimedVariedData(timeDuration, sybmol, interval) {
    let duration = "TIME_SERIES_WEEKLY"
    if (timeDuration == "Monthly") duration = "TIME_SERIES_MONTHLY"
    if (timeDuration == "Weekely") duration = "TIME_SERIES_WEEKLY"
    if (timeDuration == "Daily") duration = "TIME_SERIES_DAILY_ADJUSTED"

    let url = `https://www.alphavantage.co/query?function=${duration}&symbol=${sybmol}&apikey=${process.env.API_KEY}`
    let data = [];

    if (timeDuration == "Hourly") {
        duration = "TIME_SERIES_INTRADAY"
        url = `https://www.alphavantage.co/query?function=${duration}&symbol=${sybmol}&interval=${interval}&apikey=${process.env.API_KEY}`
    }

    console.log(url);

    let option = {
        method: "GET",
        url: url,
        headers: { 'User-Agent': 'request' },
    }
    await axios.request(option).then(function (response) {
        data = response.data;
    })
}
module.exports = { getStockInformation, getTimedVariedData , getInfoOfOneStock};
