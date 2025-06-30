const express = require('express');
const db = require('../db');

const clientRouter = express.Router();

// Get all clients
clientRouter.get('/', async (req, res) => {
  const sql = 'SELECT * FROM projects';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching clients:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

clientRouter.post('/', async (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO projects (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error('Error adding client:', err.code);
      return res.status(500).json({ error: 'Internal server error', code: err.code });
    }
    res.status(201).json({ id: result.insertId, name });
  });
});

clientRouter.delete('/', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const sql = 'DELETE FROM projects WHERE id IN (?)';
  db.query(sql, [ids], (err, result) => {
    if (err) {
      console.error('Error deleting clients:', err);
      return res.status(500).json({ error: 'Internal server error',err });
    }
    res.status(204).send();
  });
});

clientRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = 'UPDATE projects SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error('Error updating client:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ id, name });
  });
});

module.exports = clientRouter;
