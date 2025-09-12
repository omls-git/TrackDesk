import express from 'express';
import cors from 'cors';
import dB from './models/index.js';
import clientsRouter from './routes/clients.route.js';
import employeeRouter from './routes/employees.route.js';
import casesRouter from './routes/cases.routes.js';
import { startScheduler } from './controllers/autoFetchEmails.js';
import pkg from 'body-parser';
const { json } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(json({ limit: '50mb' }));

app.use('/api/cases', casesRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/clients', clientsRouter)

// Sync models and start server
dB.sequelize.sync().then(() => {
  console.log("✅ Database synced (tables created if not existing)");
  // startScheduler()
  const PORT = 5000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});