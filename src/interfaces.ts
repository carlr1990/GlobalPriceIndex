export interface OrderBook {
    bids: [string, string][];
    asks: [string, string][];
}

export interface ExchangeAdapter {
    getMidPrice(): Promise<number>;
    getName(): string;
}