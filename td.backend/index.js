const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const casesRoutes = require('./routes/cases');
const employeeRouter = require('./routes/employees');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
// Allow requests from your local
// app.use(cors({ origin: 'http://localhost:3001' }));

// allow request for production
// app.use(cors({
//   origin: 'https://your-production-frontend.com',
//   credentials: true,
// }));
// app.use('/', (req, res) => {
//   res.status(200).json({ message: 'Welcome to the API' });
// });
app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/employee', employeeRouter);

app.listen(5000, () => {
  console.log('Server running on port at: http://localhost:5000');
  // console.log(app.router.get())
  // console.log("authRoutesdsssssssssss",authRoutes)
});
