const express = require("express");
const clientsRouter = express.Router();
const clients = require("../controllers/clients.controller");
clientsRouter.post("/", clients.create);
clientsRouter.get("/", clients.findAll);
clientsRouter.get("/:id", clients.findOne);
clientsRouter.put("/:id", clients.update);
clientsRouter.delete("/", clients.deleteMany);

module.exports = clientsRouter