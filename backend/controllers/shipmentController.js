import Shipment from "../models/shipment.js";

// Create a new shipment
export const createShipment = async (req, res) => {
  const { date, storeNumber, dc, Projected, Actual } = req.body;

  // Basic validation
  if (!date || !storeNumber || !dc || !Projected) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate enum
  if (!["DC01", "DC03"].includes(dc)) {
    return res.status(400).json({ message: "Invalid DC value" });
  }

  try {
    const shipment = new Shipment({
      date,
      storeNumber,
      dc,
      Projected,
      Actual,
    });

    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Failed to create shipment" });
  }
};

export const getShipmentByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const baseDate = new Date(date);

    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const shipments = await Shipment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!shipments.length) {
      return res.status(404).json({ message: "No shipments found" });
    }

    res.status(200).json(shipments);
  } catch (error) {
    console.error("Error fetching shipments by date:", error);
    res.status(500).json({ message: "Failed to fetch shipments" });
  }
};
// Get all shipments
export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Failed to fetch shipments." });
  }
};
