import Employee from "../models/Employee.js";

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("homeStore");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// Create a new employee
export const createEmployee = async (req, res) => {
  const { first_name, last_name, position, homeStore } = req.body;

  if (!first_name || !last_name || !position || !homeStore) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const employee = new Employee({
      first_name,
      last_name,
      position,
      homeStore,
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Failed to create employee" });
  }
};

// Get one employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "homeStore"
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

// Delete an employee by ID
export const deleteEmployee = async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};

// Bulk create employees
export const bulkCreateEmployees = async (req, res) => {
  const employees = req.body;

  if (!Array.isArray(employees) || employees.length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must be a non-empty array" });
  }

  const invalid = employees.find(
    (e) => !e.first_name || !e.last_name || !e.position || !e.homeStore
  );

  if (invalid) {
    return res
      .status(400)
      .json({
        message:
          "All employees must include first_name, last_name, position, and homeStore",
      });
  }

  try {
    const inserted = await Employee.insertMany(employees);
    res
      .status(201)
      .json({
        message: `Inserted ${inserted.length} employees`,
        data: inserted,
      });
  } catch (error) {
    console.error("Error inserting employees:", error);
    res.status(500).json({ message: "Bulk insert failed" });
  }
};
