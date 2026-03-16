const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api', (req, res) => {
  res.json({
    name: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      fdap: '/api/fdap',
      users: '/api/users',
      media: '/api/media'
    }
  });
});

// TODO: Import routes
// const authRoutes = require('./routes/auth');
// const fdapRoutes = require('./routes/fdap');
// const usersRoutes = require('./routes/users');
// const mediaRoutes = require('./routes/media');

// app.use('/api/auth', authRoutes);
// app.use('/api/fdap', fdapRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/media', mediaRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on port ${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});