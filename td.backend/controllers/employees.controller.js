import { formattedIST } from "../common.js";
import dB from "../models/index.js";
const extractedDate = formattedIST();

const Employees = dB.employeeTracker;

export async function create(req, res) {
  try {
    const createdOn = extractedDate;
    const { username, email, projectId, level, permission, createdBy, assignTriage } = req.body;
    const existingEmployee = await Employees.findOne({
      where: { email, projectId }
    });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee in projectId already exists." });
    }
    const employee = await Employees.create({
      username,
      email,
      projectId,
      level,
      permission,
      assignTriage,
      createdBy,
      createdOn
    });
    
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function findAll(req, res) {
  try {
    const employees = await Employees.findAll();
    res.json(employees);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function findOne(req, res) {
  try {
    const id = req.params.id;
    const employee = await Employees.findByPk(id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function update(req, res) {
  try {
    const id = req.params.id;
    const modifiedOn = extractedDate;
    // Assume formattedIST is a util function imported elsewhere
    const updateData = { ...req.body, modifiedOn };
    const [updated] = await Employees.update(updateData, { where: { id } });
    if (updated) {
      const updatedEmployee = await Employees.findByPk(id);
      res.json(updatedEmployee);
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteMany(req, res) {
  try {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("No ids provided");
    }
    const deleted = await Employees.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).send(error.message);
  }
}