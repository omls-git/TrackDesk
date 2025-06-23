const express = require('express');
const db = require('../db');
const caseRouter = express.Router();

caseRouter.get('/', (req, res) => {
  const sql = 'SELECT * FROM cases';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch cases' });
    res.json(results);
  });
});

const getCasesByCaseNum = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cases WHERE caseNumber = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

const getCasesById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cases WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

caseRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  getCasesById(id)
    .then(results => {
      if (results.length === 0) {
        return res.status(404).json({ error: 'Case not found' });
      }
      res.json(results[0]);
    })
    .catch(err => {
      console.error('Error fetching case:', err);
      res.status(500).json({ error: 'Failed to fetch case' });
    });
});

caseRouter.post('/', (req, res) => {
    const cases = req.body;
  if (Array.isArray(req.body)) {
    // Bulk create if array is sent
    if (cases.length === 0) {
      return res.status(400).json({ error: 'Cases array is required' });
    }
    // const values = cases.map(c => [c.title, c.description, c.status]);
    // Validate all required fields for each case
    for (const c of cases) {
      if (
      !c.project_id ||
      !c.caseNumber
      ) {
      return res.status(400).json({ error: 'Missing required fields in one or more cases' });
      }
    }
    const values = cases.map(c => [
      c.project_id,
      c.casesOpen,
      c.caseNumber,
      c.initial_fup_fupToOpen || null,
      c.ird_frd || null,
      c.assignedDateDe || null,
      c.de || null,
      c.assignedDateQr || null,
      c.qr || null,
      c.assignedDateMr || null,
      c.mr || null,
      c.caseStatus || null,
      c.reportability || null,
      c.seriousness || null,
      c.live_backlog || null,
      c.comments || null,
      c.isCaseOpen
    ]);
    const sql = `INSERT INTO cases (
      project_id, casesOpen, caseNumber, initial_fup_fupToOpen, ird_frd,
      assignedDateDe, de, assignedDateQr, qr, completedDateMr, mr, caseStatus, reportability, seriousness,
      live_backlog, comments, isCaseOpen
    ) VALUES ?`;
    // Using ? to insert multiple rows at once
    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create cases' });
      res.status(201).json({ message: 'Cases created successfully', affectedRows: result.affectedRows });
    });
  } else {
    // Single create
    console.log("casessss", cases.caseNumber, cases.project_id)
    const {
        project_id,
        casesOpen,
        caseNumber,
        initial_fup_fupToOpen,
        ird_frd,
        assignedDateDe,
        de,
        assignedDateQr,
        qr,
        assignedDateMr,
        mr,
        caseStatus,
        reportability,
        seriousness,
        live_backlog,
        comments,
        isCaseOpen,
        DestinationForReporting,
        ReportingComment ,
        SDEAObligation,
        Source,
        ReportType,
        XML_Non_XML
      } = req.body;
    if (!project_id || !caseNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const sql = `INSERT INTO cases (
      project_id, casesOpen, caseNumber, initial_fup_fupToOpen, ird_frd,
      assignedDateDe, de, assignedDateQr, qr,
      assignedDateMr, mr, caseStatus, reportability, seriousness,
      live_backlog, comments, isCaseOpen, DestinationForReporting, ReportingComment, SDEAObligation, Source, ReportType, XML_Non_XML
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      project_id,
      casesOpen,
      caseNumber,
      initial_fup_fupToOpen || null,
      ird_frd || null,
      assignedDateDe || null,
      de || null,
      assignedDateQr || null,
      qr || null,
      assignedDateMr || null,
      mr || null,
      caseStatus || null,
      reportability || null,
      seriousness || null,
      live_backlog || null,
      comments || null,
      isCaseOpen,
      DestinationForReporting || null,
      ReportingComment || null,
      SDEAObligation || null,
      Source || null,
      ReportType || null,
      XML_Non_XML || null
    ];
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create case', err });
      res.status(201).json({ message: 'Case created successfully', id: result.insertId });
    });
  }
});


caseRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  // const result = null
  console.log("id", id)
  getCasesById(id)
    .then(results => {
      if (results.length === 0) {
        return res.status(404).json({ error: 'Case not found' });
      }
     const result = results[0];
  const {
    project_id,
    casesOpen,
    caseNumber,
    initial_fup_fupToOpen,
    ird_frd,
    assignedDateDe,
    completedDateDE,
    de,
    assignedDateQr,
    completedDateQR,
    qr,
    assignedDateMr,
    completedDateMr,
    mr,
    caseStatus,
    reportability,
    seriousness,
    live_backlog,
    comments,
    isCaseOpen
  } = req.body;

  if (!project_id || !caseNumber) {
    return res.status(400).json({ error: 'project_id and caseNumber are required' });
  }

  const sql = `UPDATE cases SET
    project_id = ?,
    casesOpen = ?,
    caseNumber = ?,
    initial_fup_fupToOpen = ?,
    ird_frd = ?,
    assignedDateDe = ?,
    completedDateDE = ?,
    de = ?,
    assignedDateQr = ?,
    completedDateQR = ?,
    qr = ?,
    assignedDateMr = ?,
    completedDateMr = ?,
    mr = ?,
    caseStatus = ?,
    reportability = ?,
    seriousness = ?,
    live_backlog = ?,
    comments = ?,
    isCaseOpen = ?
    WHERE id = ?`;

  const values = [
    project_id || result.project_id,
    casesOpen || result.casesOpen,
    caseNumber  || result.caseNumber,
    initial_fup_fupToOpen || result.initial_fup_fupToOpen || null,
    ird_frd || result.ird_frd || null,
    assignedDateDe || result.assignedDateDe || null,
    completedDateDE || result.completedDateDE || null,
    de || result.de || null,
    assignedDateQr || result.assignedDateQr || null,
    completedDateQR || result.completedDateQR || null,
    qr || result.qr || null,
    assignedDateMr || result.assignedDateMr || null,
    completedDateMr || result.completedDateMr || null,
    mr || result.mr || null,
    caseStatus || result.caseStatus || null,
    reportability || result.reportability || null,
    seriousness || result.seriousness || null,
    live_backlog || result.live_backlog || null,  
    comments || result.comments || null,
    isCaseOpen,
    id
  ];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update case',err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Case not found' });
    res.json({ message: 'Case updated successfully' });
  });
  
    })
    .catch(err => { 
      console.error('Error fetching case:', err);
      return res.status(500).json({ error: 'Failed to fetch case' });
    });
});

caseRouter.delete('/', (req, res) => { 
  if (Array.isArray(req.body.ids)) {
    // Bulk delete if id is an array (shouldn't happen via URL param, but for completeness)
     const  ids = req.body.ids;
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM cases WHERE id IN (${placeholders})`;
    db.query(sql, ids, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete cases' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'No cases found for deletion', status: 404 });
      res.json({ message: 'Cases deleted successfully', affectedRows: result.affectedRows, status: 200 });
    });
  } else {
    // Single delete
     const id  = req.body.id;
     if(!id) {
      return res.status(400).json({ error: 'ID is required for deletion' });
     }
    const sql = 'DELETE FROM cases WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete case' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Case not found' });
      res.json({ message: 'Case deleted successfully',status: 200 });
    });
  }
});


module.exports = caseRouter;
