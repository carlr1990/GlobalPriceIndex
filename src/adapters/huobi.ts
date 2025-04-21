import axios from 'axios';
import { ExchangeAdapter } from '../interfaces';
import { EXCHANGES, SYMBOL } from '../config';

export class HuobiAdapter implements ExchangeAdapter {
    public async getMidPrice(): Promise<number> {
        try {
            const response = await axios
                .get(`${EXCHANGES.HUOBI.REST_URL}/depth?symbol=${SYMBOL.toLowerCase()}&type=step0`);

            const orderBook = response.data.tick;
            const bestBid = parseFloat(orderBook.bids[0][0]);
            const bestAsk = parseFloat(orderBook.asks[0][0]);

            return (bestBid + bestAsk) / 2;
        } catch (error) {
            console.error('Failed to fetch Huobi order book:', error);
            throw error;
        }
    }

    public getName(): string {
        return 'Huobi';
    }
}