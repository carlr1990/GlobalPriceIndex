import {KrakenAdapter} from "../src/adapters/kraken";
import axios from "axios";

jest.mock('axios');
const mockKrakenResponse = {
    result: {
        XBTUSDT: {
            bids: [["80000.000", "1.200"]],
            asks: [["80100.000", "1.300"]]
        }
    }
};

describe('KrakenAdapter', () => {
    let adapter: KrakenAdapter;

    beforeEach(() => {
        adapter = new KrakenAdapter();
        (axios.get as jest.Mock).mockResolvedValue({ data: mockKrakenResponse });
    });

    describe('getMidPrice', () => {
        it('should fetch and calculate mid price correctly', async () => {
            const price = await adapter.getMidPrice();
            const bestBid = parseFloat(mockKrakenResponse.result.XBTUSDT.bids[0][0]);
            const bestAsk = parseFloat(mockKrakenResponse.result.XBTUSDT.asks[0][0]);
            const expected = (bestBid + bestAsk) / 2;

            expect(price).toBe(expected);
        });

        it('should handle API errors', async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));
            await expect(adapter.getMidPrice()).rejects.toThrow();
        });
    });
});