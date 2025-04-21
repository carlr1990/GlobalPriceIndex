import {BinanceAdapter} from "../src/adapters/binance";

describe('BinanceAdapter', () => {
    let adapter: BinanceAdapter;

    beforeEach(() => {
        adapter = new BinanceAdapter();
    });


    it('should calculate correct mid price', async () => {
        // Set up initial order book state
        adapter['orderBook'] = {
            bids: [['80000.00', '1.0']],
            asks: [['80100.00', '1.0']]
        };

        const price = await adapter.getMidPrice();
        expect(price).toBe(80050.00);
    });

    it('should throw error for empty order book', async () => {
        adapter['orderBook'] = { bids: [], asks: [] };
        await expect(adapter.getMidPrice()).rejects.toThrow(
            'Binance order book not initialized'
        );
    });

});