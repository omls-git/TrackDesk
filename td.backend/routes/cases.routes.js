const express = require("express");
const casesController = require("../controllers/cases.controller");

const casesRouter = express.Router();

casesRouter.post("/", casesController.create);
casesRouter.get("/", casesController.findAll);
casesRouter.get("/by-project/:project_id", casesController.findByProject);
casesRouter.get("/:id", casesController.findOne);
casesRouter.put("/:id", casesController.update);
casesRouter.delete("/", casesController.deleteMany);
casesRouter.get("/by-number/:caseNumber", casesController.findOneByNumber);

module.exports = casesRouter;