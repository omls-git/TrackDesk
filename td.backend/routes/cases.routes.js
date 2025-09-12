import { Router } from "express";
import { create, findAll, findByProject, findOne, update, deleteMany, findOneByNumber } from "../controllers/cases.controller.js";

const casesRouter = Router();

casesRouter.post("/", create);
casesRouter.get("/", findAll);
casesRouter.get("/by-project/:project_id", findByProject);
casesRouter.get("/:id", findOne);
casesRouter.put("/:id", update);
casesRouter.delete("/", deleteMany);
casesRouter.get("/by-number/:caseNumber", findOneByNumber);

export default casesRouter;