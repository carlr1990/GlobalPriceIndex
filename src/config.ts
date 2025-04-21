export const PORT = 8008;

export const EXCHANGES = {
    BINANCE: {
        WS_URL: 'wss://stream.binance.com:9443/ws',
        REST_URL: 'https://api.binance.com/api/v3',
    },
    KRAKEN: {
        REST_URL: 'https://api.kraken.com/0/public',
    },
    HUOBI: {
        REST_URL: 'https://api.huobi.pro/market',
    },
};

export const SYMBOL = 'BTCUSDT';
export const KRAKEN_SYMBOL = 'XBTUSDT';