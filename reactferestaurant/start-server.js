/**
 * Script to start json-server with CORS enabled
 * Usage: node start-server.js
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  noCors: false,
  readOnly: false,
  static: './public'
});

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.use(middlewares);
server.use(router);

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ JSON Server is running on http://localhost:${PORT}`);
  console.log(`📁 Database: db.json`);
  console.log(`🌐 CORS: Enabled`);
  console.log(`\n🔗 Available endpoints:`);
  console.log(`   - http://localhost:${PORT}/users`);
  console.log(`   - http://localhost:${PORT}/restaurants`);
  console.log(`   - http://localhost:${PORT}/tables`);
  console.log(`   - http://localhost:${PORT}/services`);
  console.log(`   - http://localhost:${PORT}/bookings`);
  console.log(`   - http://localhost:${PORT}/customers`);
  console.log(`\n💡 React app should connect to: http://localhost:${PORT}`);
  console.log(`   (Proxy is configured in package.json)\n`);
  console.log(`📝 To test: Open http://localhost:${PORT}/users in your browser\n`);
});

