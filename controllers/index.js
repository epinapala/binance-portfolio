const binance = require('node-binance-api');
binance.options({
  'APIKEY': process.argv[2],
  'APISECRET': process.argv[3]
});

exports.getPortfolio = function (req, res) {
  new Promise((resolve, reject) => {
    binance.prices(function (ticker) {
      resolve(ticker);
    });
  }).then(function (ticker) {
    return new Promise((resolve, reject) => { // (*)
      binance.balance(function (data) {
        let response = {
          total: {
            ETH: 0.00,
            USD: 0
          },
          balances: []
        };
        for (let key of Object.keys(data)) {
          let coin = data[key];
          if (coin.available == "0.00000000") {
            continue;
          } else {
            coin.symbol = key;
            let ethValue = ticker[key + 'ETH'];
            if (isNaN(ethValue)) {
              coin.ETH = 0.00;
            } else {
              coin.ETH = coin.available * ethValue;
            }

            response.balances.push(coin);
            response.total.ETH += parseFloat(coin.ETH);
          }
        }
        response.total.USD = response.total.ETH * ticker.ETHUSDT;
        resolve(response);
      });
    });
  }).then(function (response) {
    res.send(response);
  });
};

exports.getTicker = function (req, res) {
  new Promise((resolve, reject) => {
    binance.prices(function (ticker) {
      resolve(ticker);
    });
  }).then(function (ticker) {
    let symbol =  req.params['symbol'] && req.params['symbol'].toUpperCase();
    let response = {};
    response.symbol = symbol;
    response.value = ticker[symbol];
    res.json(response);
  });
};