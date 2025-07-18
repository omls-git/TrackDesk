const dB = require("../models");
const extractedDate = require('../common').formattedIST();

const Employees = dB.employeeTracker;

exports.create = async (req, res) => {
  try {
    const createdOn = extractedDate;
    const { username, email, projectId, level, permission, createdBy } = req.body;
    // Assume formattedIST is a util function imported elsewhere
    const employee = await Employees.create({
      username,
      email,
      projectId,
      level,
      permission,
      createdBy,
      createdOn
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.findAll = async (req, res) => {
  try {
    const employees = await Employees.findAll();
    res.json(employees);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.findOne = async (req, res) => {
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
};

exports.update = async (req, res) => {
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
};

exports.deleteMany = async (req, res) => {
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
};