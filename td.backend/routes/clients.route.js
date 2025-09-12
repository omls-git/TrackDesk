import { Router } from "express";
const clientsRouter = Router();
import { create, findAll, findOne, update, deleteMany } from "../controllers/clients.controller.js";
clientsRouter.post("/", create);
clientsRouter.get("/", findAll);
clientsRouter.get("/:id", findOne);
clientsRouter.put("/:id", update);
clientsRouter.delete("/", deleteMany);

export default clientsRouter