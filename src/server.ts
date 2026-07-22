/**
 * local server entry file, for local development
 */
import app from './app.js';
import { config } from './config/index.js';

/**
 * start server with port
 */
const PORT = config.port;

const HOST = '127.0.0.1';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server ready at http://${HOST}:${PORT}`);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
