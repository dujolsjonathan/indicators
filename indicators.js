const StochasticRSI = require('technicalindicators').StochasticRSI;
const EMA = require('technicalindicators').EMA;
const SMA = require('technicalindicators').SMA;
const TRIX = require('technicalindicators').TRIX;

// console.log(ti.SMA())
const tenkan = (data) => {
    let higher = 0;
    let lower = 1000000;
    for (i = data.length - 2; i > data.length - 9 - 2; i--) {
        parseInt(data[i].high) > higher ? (higher = parseInt(data[i].high)) : false;
        parseInt(data[i].low) < lower ? (lower = parseInt(data[i].low)) : false;
    }
    return (higher + lower) / 2
}

const kijun = (data) => {
    let higher = 0;
    let lower = 1000000;
    for (i = data.length - 2; i > data.length - 26 - 2; i--) {
        parseInt(data[i].high) > higher ? (higher = parseInt(data[i].high)) : false;
        parseInt(data[i].low) < lower ? (lower = parseInt(data[i].low)) : false;
    }
    return (higher + lower) / 2
}

const leadingSpanA = (data, delay) => {
    let newData = []
    if (delay <= -26) {
        newData = data;
    } else {
        newData = data.slice(0, -26 - delay)
    }
    return (tenkan(newData) + kijun(newData)) / 2
}

const leadingSpanB = (data, delay) => {
    let newData = []
    if (delay <= -26) {
        newData = data;
    } else {
        newData = data.slice(0, -26 - delay)
    }
    let higher = 0;
    let lower = 1000000;
    for (i = newData.length - 1; i > newData.length - 52 - 1; i--) {
        parseInt(newData[i].high) > higher ? (higher = parseInt(newData[i].high)) : false;
        parseInt(newData[i].low) < lower ? (lower = parseInt(newData[i].low)) : false;
    }
    return (higher + lower) / 2
}

const ema = (data, period, delay) => {
    let newData = []
    if (delay <= 0) {
        newData = data;
    } else {
        newData = data.slice(0, - delay - 1)
    }

    let sum = 0
    let higher = 0;
    let lower = 1000000;
    for (i = newData.length - period; i < newData.length; i++) {
        parseInt(newData[i].high) > higher ? (higher = parseInt(newData[i].high)) : false;
        parseInt(newData[i].low) < lower ? (lower = parseInt(newData[i].low)) : false;
        // console.log(newData[i])
        sum = sum + ((parseInt(newData[i].high) + parseInt(newData[i].low)) / 2)
    }
    return sum / period
}

const ma = (data, period) => {
    let sum = 0
    for (i = data.length - period; i < data.length; i++) {
        sum = sum + (parseInt(data[i].close))
        // console.log(data[i])
    }
    return sum / period
}

const stockRsi = (data) => {
    // console.log(data.length)
    const newData = data.slice(0, -1);
    let values = []
    // for (i = newData.length - 1; i > newData.length - 1 - 40; i--) {
    //     values.push(newData[i].close)
    //     // console.log(newData[i])
    // }
    for (i = 1; i < newData.length - 1; i++) {
        values.push(newData[i].close)
        // console.log(newData[i])
    }
    const result = new StochasticRSI({
        values: values,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    })
    return result.getResult();
}

const emaFunc = (data, length) => {
    const result = EMA.calculate({
        values: data,
        period: length
    })
    return result;
}

const smaFunc = (data, length) => {
    // console.log(data)
    const result = SMA.calculate({
        values: data,
        period: length
    })
    return result;
}

const trixFunc = (values, length, signal) => {
    // console.log(data.length)
    // const newData = data.slice(0, -1);
    // let values = []
    // // for (i = newData.length - 1; i > newData.length - 1 - 40; i--) {
    // //     values.push(newData[i].close)
    // //     // console.log(newData[i])
    // // }
    // for (i = 1; i < newData.length - 1; i++) {
    //     values.push(newData[i].close)
    //     // console.log(newData[i])
    // }
    // console.log(newData)
    let trix = emaFunc(emaFunc(emaFunc(values, length), length), length);
    // console.log('trix1 :' + trix);
    // trix = emaFunc(trix, length);
    // // console.log('trix2 :' + trix);
    // trix = emaFunc(trix, length);
    // console.log('trix3 :' + trix);
    console.log(trix[trix.length -2]);
    console.log(trix[trix.length -1]);

    const trixPct = trix.map((el, index) => {
        if (index === 0) {
            return 0
        } else {
            const result = ((el - trix[index - 1]) / trix[index - 1]) *100
            return result

        }
    })
    console.log('trixPct ' + trixPct[trixPct.length -1])

    const trixSignal = smaFunc(trixPct, signal)

    console.log('trixSignal ' + trixSignal[trixSignal.length -1])

     const trixHisto = trixPct.map((el, index) => {
        return el - trixSignal[index]
    })
    // console.log(trixHisto)
    return trixHisto;
}

const indicators = (data) => {
    // console.log(data)
    let values = []
    for (i = 0; i < data.length; i++) {
        values.push(parseInt(data[i].close))
        // console.log(newData[i])
    }
    return {
        // stockRsi: stockRsi(data),
        trix: trixFunc(values, 21, 9),
        ema: emaFunc(values,9)
    }
}
module.exports = {
    tenkan,
    kijun,
    leadingSpanA,
    leadingSpanB,
    ema,
    ma,
    indicators,
};