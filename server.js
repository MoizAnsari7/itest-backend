const express = require('express');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/question');
const questionTypeRoutes = require('./routes/questionType');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api', questionRoutes);
app.use('/api', questionTypeRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch(err => console.error(err));
