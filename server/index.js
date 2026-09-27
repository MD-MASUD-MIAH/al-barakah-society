// Configure reliable DNS servers for Node on Windows before network calls
try {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Entry point proxy for server.js
require('./server');
