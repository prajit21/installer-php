import express from 'express';
import { InstallWizard } from './index.js';

const app = express();

// Add basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create and mount wizard
const wizard = new InstallWizard();
wizard.mount(app);

// Add debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Error: ' + err.message);
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test route works!');
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
  console.log('Test routes:');
  console.log(`- http://localhost:${PORT}/test`);
  console.log(`- http://localhost:${PORT}/install`);
});