const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const clientRouter = require('./routes/clients');
const dB = require('./models');
const clientsRouter = require('./routes/clients.route');
const employeeRouter = require('./routes/employees.route');
const casesRouter = require('./routes/cases.routes');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
// Allow requests from your local
// app.use(cors({ origin: 'http://localhost:5000' }));

// allow request for production
// app.use(cors({
//   origin: 'https://your-production-frontend.com',
//   credentials: true,
// }));
// app.use('/', (req, res) => {
//   res.status(200).json({ message: 'Welcome to the API' });
// // });
// app.use('/api/auth', authRoutes);

app.use('/api/cases', casesRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/clients', clientsRouter)

// Sync models and start server
dB.sequelize.sync().then(() => {
  console.log("✅ Database synced (tables created if not existing)");

  const PORT = 5000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});