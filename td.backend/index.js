const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const casesRoutes = require('./routes/cases');

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/cases', require('./routes/cases'));
app.use('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

app.listen(5000, () => {
  console.log('Server running on port at: http://localhost:5000');
  // console.log(app.router.get())
  // console.log("authRoutesdsssssssssss",authRoutes)
});
