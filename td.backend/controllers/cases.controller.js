const dB = require("../models");

const Cases = dB.cases;

exports.create = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      if (req.body.length === 0) {
        return res.status(400).json({ error: 'Cases array is required' });
      }
      const cases = await Cases.bulkCreate(req.body);
      res.status(201).json(cases);
    } else {
      const createdCase = await Cases.create(req.body);
      res.status(201).json(createdCase);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.findAll = async (req, res) => {
  try {
    let where = {};
    if (req.query.isOpen) {
      where.isCaseOpen = true;
    }
    if (req.query.project_id) {
      where.project_id = req.query.project_id;
    }
    const cases = await Cases.findAll({ where });
    if (req.query.isOpen && cases.length === 0) {
      return res.status(404).json({ error: "Open Cases not found" });
    }
    res.json(cases);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.findByProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    if (!project_id) {
      return res.status(400).json({ error: 'project_id is required' });
    }
    const cases = await Cases.findAll({ where: { project_id } });
    if (cases.length === 0) {
      return res.status(404).json({ error: 'No cases found for this project_id' });
    }
    res.json(cases);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const foundCase = await Cases.findByPk(id);
    if (foundCase) {
      res.json(foundCase);
    } else {
      res.status(404).json({ error: 'Case not found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Cases.update(req.body, { where: { id } });
    if (updated) {
      const updatedCase = await Cases.findByPk(id);
      res.json(updatedCase);
    } else {
      res.status(404).json({ error: 'Case not found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteMany = async (req, res) => {
  try {
    if (Array.isArray(req.body.ids)) {
      const ids = req.body.ids;
      if (!ids.length) {
        return res.status(400).json({ error: 'No ids provided' });
      }
      const deleted = await Cases.destroy({ where: { id: ids } });
      if (deleted === 0) {
        return res.status(404).json({ error: 'No cases found for deletion' });
      }
      res.json({ deleted });
    } else {
      const id = req.body.id;
      if (!id) {
        return res.status(400).json({ error: 'ID is required for deletion' });
      }
      const deleted = await Cases.destroy({ where: { id } });
      if (deleted === 0) {
        return res.status(404).json({ error: 'Case not found' });
      }
      res.json({ deleted });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};