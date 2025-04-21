import {ExchangeAdapter} from "../interfaces";
import {BinanceAdapter} from "../adapters/binance";
import {KrakenAdapter} from "../adapters/kraken";
import {HuobiAdapter} from "../adapters/huobi";

export class PriceService {
    private adapters: ExchangeAdapter[];

    constructor() {
        this.adapters = [
            new BinanceAdapter(),
            new KrakenAdapter(),
            new HuobiAdapter()
        ];
    }

    public async getGlobalPriceIndex(): Promise<{
        prices: Record<string, number>;
        globalIndex: number;
    }> {
        const prices: Record<string, number> = {};
        let sum = 0;
        let count = 0;

        for (const adapter of this.adapters) {
            try {
                const price = await adapter.getMidPrice();
                prices[adapter.getName()] = price;
                sum += price;
                count++;
            } catch (error) {
                console.error(`Failed to get price from ${adapter.getName()}:`, error);
            }
        }

        if (count === 0) {
            throw new Error('All exchanges are unreachable');
        }

        return {
            prices,
            globalIndex: sum / count,
        };
    }
}