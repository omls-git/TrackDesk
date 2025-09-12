import dB from "../models/index.js";

const Clients = dB.clients;

export async function create(req, res){
  try {
    const client = await Clients.create(req.body);
    res.status(201).json(client)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export async function findAll(req, res) {
  try {
    const clients = await Clients.findAll();
    res.json(clients)
  } catch (error) {
     res.status(500).send(error.message)
  }
}

export async function update(req, res) {
  try {
    const id = req.params.id;
    
    const [updated] = await Clients.update(req.body, { where: { id } });
    if (updated) {
      const updatedClient = await Clients.findByPk(id);
      res.json(updatedClient);
    } else {
      res.status(404).send("Client not found");
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
    const deleted = await Clients.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function findOne(req, res) {
  try {
    const id = req.params.id;
    const client = await Clients.findByPk(id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).send("Client not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

