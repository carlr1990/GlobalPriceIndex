import axios from "axios";
import {HuobiAdapter} from "../src/adapters/huobi";

jest.mock('axios');
const mockHuobiResponse = {
    tick: {
        bids: [["79900.00", "1.5"]],
        asks: [["80050.00", "2.0"]]
    }
};

describe('HuobiAdapter', () => {
    let adapter: HuobiAdapter;

    beforeEach(() => {
        adapter = new HuobiAdapter();
        (axios.get as jest.Mock).mockResolvedValue({ data: mockHuobiResponse });
    });

    describe('getMidPrice', () => {
        it('should fetch and calculate mid price correctly', async () => {
            const price = await adapter.getMidPrice();
            const bestBid = parseFloat(mockHuobiResponse.tick.bids[0][0]);
            const bestAsk = parseFloat(mockHuobiResponse.tick.asks[0][0]);
            const expected = (bestBid + bestAsk) / 2;

            expect(price).toBe(expected);
        });

        it('should handle API errors', async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));
            await expect(adapter.getMidPrice()).rejects.toThrow();
        });
    });
});