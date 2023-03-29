const axios = require("axios");
const stockName = require("../assets/StocksData.json")
const fs = require('fs');
const { time } = require("console");
require("dotenv").config() ;
// const options = {
//     url: "https://realstonks.p.rapidapi.com/AAPL",
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Key': '2672419d46mshaba07eccc62d511p1a4ae8jsn56866a8d9340',
//         'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
//     }
// };



// const url = "https://realstonks.p.rapidapi.com/";
// async function getRealTimeStockData() {
//     const data = []
//     stockName.map(async (stock, key) => {
//         let newUrl = url + stock.Symbol;
//         // options.url = newUrl;
//         await axios.request(options).then(function (response) {
//             console.log(response.data);
//         }).catch(function (error) {
//             console.error(error);
//         })
//     })

// }


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



async function getTimedVariedData(timeDuration, sybmol, interval)
{
    let duration = "TIME_SERIES_WEEKLY"
    if( timeDuration == "Monthly") duration = "TIME_SERIES_MONTHLY"
    if( timeDuration == "Weekely") duration = "TIME_SERIES_WEEKLY"
    if( timeDuration == "Daily") duration = "TIME_SERIES_DAILY_ADJUSTED"
 
    let url = `https://www.alphavantage.co/query?function=${duration}&symbol=${sybmol}&apikey=${process.env.API_KEY}`
    let data = [] ;

    if( timeDuration == "Hourly")
    {
        duration = "TIME_SERIES_INTRADAY"
        url = `https://www.alphavantage.co/query?function=${duration}&symbol=${sybmol}&interval=${interval}&apikey=${process.env.API_KEY}`
    } 

    let option = {
        method : "GET" ,
        url : url, 
        headers: {'User-Agent': 'request'},
    }
    await axios.request(option).then( function(response){
        data = response.data ;
    })

    var stocks = JSON.stringify(data);
    fs.writeFile("CustomData.json", stocks, function (err, result) {
        if (err) console.log('error', err);
    });

    return data
}
module.exports = { getStockInformation, getTimedVariedData };
