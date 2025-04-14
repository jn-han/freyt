import express from "express";
import {
  createStore,
  getStores,
  getStoreById,
} from "../controllers/storeController.js";

import {
  getShipmentsForStore,
  createShipmentForStore,
  getShipmentByDateForStore,
} from "../controllers/shipmentController.js";

const router = express.Router();

// ---SPECIFIC ROUTES
router.get("/stores/:storeId/shipments", getShipmentsForStore);
router.get("/stores/:storeId/shipments/:date", getShipmentByDateForStore);
router.post("/stores/:storeId/shipments", createShipmentForStore);

// GENERAL ROUTES
router.get("/", getStores);
router.post("/", createStore);
router.get("/:storeId", getStoreById);

export default router;
