import WebSocket from 'ws';
import { OrderBook, ExchangeAdapter } from '../interfaces';
import { EXCHANGES, SYMBOL } from '../config';

export class BinanceAdapter implements ExchangeAdapter {
    private orderBook: OrderBook = { bids: [], asks: [] };
    private ws: WebSocket | undefined;
    private lastUpdateId = 0;

    constructor() {
        this.initializeWebSocket();
    }

    private initializeWebSocket(): void {

        this.ws = new WebSocket(`${EXCHANGES.BINANCE.WS_URL}/${SYMBOL.toLowerCase()}@depth`);

        this.initializeOrderBook();

        this.ws.on('open', () => {
            console.log('Binance WebSocket connected');
        });

        this.ws.on('message', (data: string) => {
            const message = JSON.parse(data);

            if (message.u <= this.lastUpdateId)
                return;

            this.updateOrderBook(message);
        });

        this.ws.on('close', () => {
            console.log('Binance WebSocket disconnected. Reconnecting...');
            setTimeout(() => this.initializeWebSocket(), 1000);
        });
    }

    private async initializeOrderBook(): Promise<void> {
        try {
            const response = await fetch(`${EXCHANGES.BINANCE.REST_URL}/depth?symbol=${SYMBOL}&limit=1000`);
            const data = await response.json();

            this.orderBook = {
                bids: data.bids,
                asks: data.asks,
            };
            this.lastUpdateId = data.lastUpdateId;
        } catch (error) {
            console.error('Failed to initialize Binance order book:', error);
        }
    }

    private updateOrderBook(update: any): void {
        if (update.U > this.lastUpdateId+1) {
            console.error('Gap detected in update sequence. Resetting order book...');
            this.resetOrderBook();
            return;
        }

        this.orderBook.bids = this.mergeUpdates(this.orderBook.bids, update.b, true);
        this.orderBook.asks = this.mergeUpdates(this.orderBook.asks, update.a, false);
        this.lastUpdateId = update.u;
        //console.log('Binance OrderBook Updated');
    }

    private mergeUpdates(current: [string, string][], updates: [string, string][], isBid: boolean): [string, string][] {
        const merged = [...current];

        for (const [price, quantity] of updates) {
            const index = merged.findIndex(([p]) => p === price);

            if (index !== -1)
                if (parseFloat(quantity) === 0)
                    merged.splice(index, 1);
                else
                    merged[index] = [price, quantity];
            else
                if (parseFloat(quantity) !== 0)
                    merged.push([price, quantity]);
        }

        return merged.sort(([a], [b]) =>
            isBid ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b)
        );
    }

    private async resetOrderBook(): Promise<void> {
        try {
            console.log('Resetting Binance order book...');
            this.orderBook = { bids: [], asks: [] };
            this.lastUpdateId = 0;
            await this.initializeOrderBook();
        } catch (error) {
            console.error('Order book reset failed:', error);
            throw error;
        }
    }

    public async getMidPrice(): Promise<number> {
        if (this.orderBook.bids.length === 0 || this.orderBook.asks.length === 0) {
            throw new Error('Binance order book not initialized');
        }

        const bestBid = parseFloat(this.orderBook.bids[0][0]);
        const bestAsk = parseFloat(this.orderBook.asks[0][0]);

        return (bestBid + bestAsk) / 2;
    }

    public getName(): string {
        return 'Binance';
    }
}