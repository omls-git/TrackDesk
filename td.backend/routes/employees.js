const express = require('express');
const db = require('../db');
const employeeRouter = express.Router();

employeeRouter.get('/', (req, res) => {
  const sql = 'SELECT * FROM employeeTracker';
  db.query(sql, (err, results) => {
    if(err) return res.status(500).json({error: "Failed to fetch employees"});
    res.json(results)
  })
})

function getEmployeeById(id, callback) {
  const sql = 'SELECT * FROM employeeTracker WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
}

employeeRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  getEmployeeById(id, (err, employee) => {
    if (err) return res.status(500).json({ error: "Failed to fetch employee" });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  });
});

employeeRouter.post('/addEmployee', (req, res) => {
  const {username, email, projectId, role, onLeave} = req.body;
  const sql = 'INSERT INTO employeeTracker (username, email, projectId, role, onLeave) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [username, email, projectId, role, onLeave], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add employee" });
    res.status(201).json({ message: "Employee added successfully", id: result.insertId });
  })
})

employeeRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  getEmployeeById(id, (err, existingEmployee) => {
    if (err) return res.status(500).json({ error: "Failed to fetch employee" });
    if (!existingEmployee) return res.status(404).json({ error: "Employee not found" });

    const { username, email, projectId, role, onLeave } = req.body;
    const updatedEmployee = {
      username: username ? username : existingEmployee.username,
      email: email ? email : existingEmployee.email,
      projectId: projectId ? projectId : existingEmployee.projectId,
      role: role ? role : existingEmployee.role,
      onLeave: onLeave !== undefined ? onLeave : existingEmployee.onLeave
    };

    const sql = 'UPDATE employeeTracker SET username = ?, email = ?, projectId = ?, role = ?, onLeave = ? WHERE id = ?';
    db.query(
      sql,
      [updatedEmployee.username, updatedEmployee.email, updatedEmployee.projectId, updatedEmployee.role, updatedEmployee.onLeave, id],
      (err) => {
        if (err) return res.status(500).json({ error: "Failed to update employee" });
        res.json({ message: "Employee updated successfully" });
      }
    );
  });
})

employeeRouter.delete('/', (req, res) => {
  const { ids } = req.body;
  if (Array.isArray(ids) && ids.length > 1) {
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM employeeTracker WHERE id IN (${placeholders})`;
    db.query(sql, ids, (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to delete employees" });
      res.json({ message: "Employees deleted successfully", affectedRows: result.affectedRows });
    });
  } else {
    const id = Array.isArray(ids) ? ids[0] : ids;
    const sql = 'DELETE FROM employeeTracker WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to delete employee" });
      res.json({ message: "Employee deleted successfully", affectedRows: result.affectedRows });
    });
  }
});
module.exports = employeeRouter