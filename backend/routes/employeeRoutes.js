import express from "express";
import {
  getEmployees,
  createEmployee,
  getEmployeeById,
  deleteEmployee,
  bulkCreateEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/bulk", bulkCreateEmployees);
router.get("/", getEmployees);
router.post("/", createEmployee);
router.get("/:id", getEmployeeById);
router.delete("/:id", deleteEmployee);

export default router;
