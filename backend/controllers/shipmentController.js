import Shipment from "../models/Shipment.js";

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
      updates,
      steamBuffer,
      roster,
    });

    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Failed to create shipment" });
  }
};

export const getShipmentsForStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const shipments = await Shipment.find({ store: storeId });
    res.status(200).json(shipments);
  } catch (err) {
    console.error("Error fetching shipments:", err);
    res.status(500).json({ message: "Failed to fetch shipments" });
  }
};

export const getShipmentByDateForStore = async (req, res) => {
  const { storeId, date } = req.params;

  const baseDate = new Date(`${date}T00:00:00.000Z`);
  const start = new Date(baseDate.setHours(0, 0, 0, 0));
  const end = new Date(baseDate.setHours(23, 59, 59, 999));

  try {
    const shipments = await Shipment.find({
      store: storeId,
      date: { $gte: start, $lte: end },
    });

    if (!shipments.length) {
      return res
        .status(404)
        .json({ message: "No shipments found for this date" });
    }

    res.status(200).json(shipments);
  } catch (err) {
    console.error("Error fetching shipment:", err);
    res.status(500).json({ message: "Failed to fetch shipment" });
  }
};

export const createShipmentForStore = async (req, res) => {
  const { storeId } = req.params;
  const { date, dc, Projected, Actual, updates, steamBuffer, roster } =
    req.body;

  try {
    const shipment = new Shipment({
      store: storeId,
      date,
      dc,
      Projected,
      Actual,
      updates,
      steamBuffer,
      roster,
    });

    await shipment.save();
    res.status(201).json(shipment);
  } catch (err) {
    console.error("Failed to create shipment:", err);
    res.status(500).json({ message: "Error creating shipment" });
  }
};

export const deleteShipmentByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const baseDate = new Date(`${date}T00:00:00.000Z`);

    const startOfDay = new Date(baseDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("Deleting between:", startOfDay, "and", endOfDay);

    const result = await Shipment.deleteMany({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No shipments found for this date" });
    }

    res
      .status(200)
      .json({ message: `Deleted ${result.deletedCount} shipment(s)` });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

export const createManyShipments = async (req, res) => {
  const shipments = req.body;

  if (!Array.isArray(shipments) || shipments.length === 0) {
    return res.status(400).json({ message: "No shipments provided" });
  }

  for (const s of shipments) {
    if (!s.date || !s.store || !s.dc || !s.Projected) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  }

  try {
    const result = await Shipment.insertMany(shipments);
    res.status(201).json({ message: `Inserted ${result.length} shipments` });
  } catch (error) {
    console.error("Error inserting shipments:", error);
    res.status(500).json({ message: "Bulk insert failed" });
  }
};

export const createManyShipmentsForStore = async (req, res) => {
  const { storeId } = req.params;
  const shipments = req.body;

  if (!Array.isArray(shipments) || shipments.length === 0) {
    return res.status(400).json({ message: "No shipments provided" });
  }

  for (const s of shipments) {
    if (!s.date || !s.dc || !s.Projected) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    s.store = storeId;
  }

  try {
    const result = await Shipment.insertMany(shipments);
    res.status(201).json({
      message: `Inserted ${result.length} shipment(s) for store ${storeId}`,
      shipments: result,
    });
  } catch (err) {
    console.error("Bulk insert error:", err);
    res.status(500).json({ message: "Bulk insert failed" });
  }
};

export const getShipmentByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const baseDate = new Date(`${date}T00:00:00.000Z`);

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
