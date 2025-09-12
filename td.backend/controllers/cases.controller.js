import dB from "../models/index.js";

const Cases = dB.cases;

export async function create(req, res) {
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
}

export async function findAll(req, res) {
  try {
    let where = {};
    if (req.query.isOpen) {
      where.isCaseOpen = true;
    }
    if (req.query.project_id) {
      where.project_id = req.query.project_id;
    }
    if (req.query.status) {
      where.caseStatus = req.query.status;
    }
    const cases = await Cases.findAll({ where });
    if (req.query.isOpen && cases.length === 0) {
      return res.status(404).json({ error: "Open Cases not found" });
    }
    res.json(cases);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function findByProject(req, res) {
  try {
    const { project_id } = req.params;
    if (!project_id) {
      return res.status(400).json({ error: 'project_id is required' });
    }
    const cases = await Cases.findAll({ where: { project_id } });
    res.json(cases);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function findOne(req, res) {
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
}

export async function findOneByNumber(req, res) {
  console.log(req.query.project_id, "case number in findOneByNumber");
  const project_id = req.query.project_id;

  try {
    const caseNumber = req.params.caseNumber;
    const foundCase = await Cases.findOne({ where: { caseNumber, project_id } });
    if (foundCase) {
      res.json(foundCase);
    } else {
      res.json({ message: 'Case not found', status: 404});
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function update(req, res) {
  if (Array.isArray(req.body)) {
    await bulkUpdate(req, res);
  }else{
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
}
}

export async function deleteMany(req, res) {
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
}


const bulkUpdate = async (req, res) => {
  const casesToUpdate = req.body;  
  if (!Array.isArray(casesToUpdate)) {
    return res.status(400).json({ error: 'Request body must be an array of cases' });
  }

  try {
    const results = [];

    for (const caseData of casesToUpdate) {
      const { id, ...updateFields } = caseData;

      if (!id) {
        results.push({ error: 'Missing ID', caseData });
        continue;
      }

      const [updated] = await Cases.update(updateFields, { where: { id } });

      if (updated) {
        const updatedCase = await Cases.findByPk(id);
        results.push(updatedCase);
      } else {
        results.push({ error: 'Case not found oo', id });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).send(error);
  }
};
