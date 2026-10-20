const mongoose = require('mongoose');

// Work around networks/routers that refuse DNS SRV lookups (querySrv ECONNREFUSED) for Atlas.
// Only applies to mongodb+srv:// URIs. Override with DNS_SERVERS=ip1,ip2 in .env if needed.
if ((process.env.MONGODB_URI || '').startsWith('mongodb+srv://')) {
  const servers = (process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1').split(',').map(s => s.trim()).filter(Boolean);
  require('dns').setServers(servers);
}


// Connect to MongoDB (local OR Atlas - decided only by MONGODB_URI in .env)
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    const where = uri.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'local MongoDB';
    console.log(`MongoDB connected successfully (${where}, db: ${mongoose.connection.name})`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Atlas checklist: 1) IP added in Network Access  2) DB user/password correct (URL-encode special chars)  3) /devmarket present in the URI');
    console.error('Local checklist: is the MongoDB service running on port 27017?');
    process.exit(1);
  }
};

module.exports = connectDB;
