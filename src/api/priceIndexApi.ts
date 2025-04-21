import express from 'express';
import {PriceService} from "../services/priceService";

export function createApiRouter(priceService: PriceService): express.Router {
  const router = express.Router();

  router.get('/price-index', async (req, res) => {
    try {
      const { prices, globalIndex } = await priceService.getGlobalPriceIndex();
      res.json({
        success: true,
        data: {
          prices,
          globalIndex,
          timestamp: new Date().toUTCString(),
        },
      });
    } catch (error) {
      console.error('Failed to get global price index:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to compute global price index',
      });
    }
  });

  return router;
}