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
    // Convert string to Date object
    const targetDate = new Date(date);

    // Find shipments that match the *exact* date (time-sensitive)
    // If your date field has time, this may not work exactly — see below for a range-based option
    const shipment = await Shipment.findOne({
      date: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(24, 0, 0, 0)),
      },
    });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error("Error fetching shipment by date:", error);
    res.status(500).json({ message: "Failed to fetch shipment" });
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
