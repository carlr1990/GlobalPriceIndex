
import { ExchangeAdapter } from '../interfaces';
import { EXCHANGES, KRAKEN_SYMBOL } from '../config';
import axios from "axios";

export class KrakenAdapter implements ExchangeAdapter {
    public async getMidPrice(): Promise<number> {
        try {
            const response = await axios
                .get(`${EXCHANGES.KRAKEN.REST_URL}/Depth?pair=${KRAKEN_SYMBOL}&count=1`);

            const result = response.data.result;
            const pairKey = Object.keys(result)[0];
            const orderBook = result[pairKey];

            const bestBid = parseFloat(orderBook.bids[0][0]);
            const bestAsk = parseFloat(orderBook.asks[0][0]);

            return (bestBid + bestAsk) / 2;
        } catch (error) {
            console.error('Failed to fetch Kraken order book:', error);
            throw error;
        }
    }

    public getName(): string {
        return 'Kraken';
    }
}