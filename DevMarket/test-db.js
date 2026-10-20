// Quick check: node test-db.js   (or: npm run test:db)
require('dotenv').config();

// Work around networks/routers that refuse DNS SRV lookups (querySrv ECONNREFUSED) for Atlas.
// Only applies to mongodb+srv:// URIs. Override with DNS_SERVERS=ip1,ip2 in .env if needed.
if ((process.env.MONGODB_URI || '').startsWith('mongodb+srv://')) {
  const servers = (process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1').split(',').map(s => s.trim()).filter(Boolean);
  require('dns').setServers(servers);
}

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    const cols = await mongoose.connection.db.listCollections().toArray();
    console.log('OK - connected to database:', mongoose.connection.name);
    console.log('Collections:', cols.map(c => c.name).join(', ') || '(none yet - created when you use the app)');
    process.exit(0);
  } catch (e) {
    console.error('FAILED:', e.message);
    process.exit(1);
  }
})();
