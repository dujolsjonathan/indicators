const indicators = require('./indicators');
const Binance = require('binance-api-node').default

const candlesLimit = 250;

const client = Binance();
const start = async () => {
    try {
        const data = await client.futuresCandles({ symbol: 'BTCUSDT', interval: '1m', limit: candlesLimit });
        // console.log(data)
        const indic = indicators.indicators(data)
        console.log(indic.ema[indic.ema.length -4])
        console.log(indic.ema[indic.ema.length -3])
        console.log(indic.ema[indic.ema.length -2])
        console.log(indic.ema[indic.ema.length -1])
    } catch (error) {
        console.log(error)
    }
}

start();
setInterval(start, 3000)

