require('dotenv').config();
const express = require('express');
const cors = require('cors');
const lessonsRoutes = require('./routes/lessons');
const submissionsRoutes = require('./routes/submissions');
const analyticsRoutes = require('./routes/analytics');
const teachingRoutes = require('./routes/teaching');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/lessons', lessonsRoutes);
app.use('/submissions', submissionsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/teaching', teachingRoutes);

// simple health
app.get('/', (req, res) => res.json({ status: 'ok', service: 'profai-backend' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ProfAI backend listening on port ${PORT}`));
