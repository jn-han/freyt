import Store from "../models/Store.js";

// Create a new store
export const createStore = async (req, res) => {
  const { _id, name, location } = req.body;

  // Validate required fields
  if (!_id || !name || !location) {
    return res
      .status(400)
      .json({ message: "Missing required store fields (_id, name, location)" });
  }

  try {
    const existing = await Store.findById(_id);
    if (existing) {
      return res
        .status(409)
        .json({ message: `Store with ID '${_id}' already exists.` });
    }

    const store = new Store({ _id, name, location });
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Failed to create store" });
  }
};

export const getStoreById = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ message: "Failed to fetch store" });
  }
};
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};
