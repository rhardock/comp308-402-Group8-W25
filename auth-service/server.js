require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authSchema = require('./config/authSchema'); 

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/graphql', authSchema);

const PORT = process.env.AUTH_SERVICE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
