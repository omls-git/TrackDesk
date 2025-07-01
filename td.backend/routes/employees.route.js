const express = require("express");
const employeeRouter = express.Router();
const employees = require("../controllers/employees.controller");
employeeRouter.post("/addEmployee", employees.create);
employeeRouter.get("/", employees.findAll);
employeeRouter.get("/:id", employees.findOne);
employeeRouter.put("/:id", employees.update);
employeeRouter.delete("/", employees.deleteMany);

module.exports = employeeRouter