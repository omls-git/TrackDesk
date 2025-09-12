import { Router } from "express";
const employeeRouter = Router();
import { create, findAll, findOne, update, deleteMany } from "../controllers/employees.controller.js";
employeeRouter.post("/addEmployee", create);
employeeRouter.get("/", findAll);
employeeRouter.get("/:id", findOne);
employeeRouter.put("/:id", update);
employeeRouter.delete("/", deleteMany);

export default employeeRouter