const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
  console.log(`Access local health check at http://localhost:${PORT}/api/health`);
});
