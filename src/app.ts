import express from "express";
import {PriceService} from "./services/priceService";
import {createApiRouter} from "./api/priceIndexApi";

export class App {
    private app: express.Application;
    private priceService: PriceService;

    constructor() {
        this.app = express();
        this.priceService = new PriceService();
        this.app.use(express.json());
        this.app.use('/api', createApiRouter(this.priceService));
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}