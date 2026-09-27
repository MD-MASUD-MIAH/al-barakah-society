const dns = require('dns');

// Use Google & Cloudflare DNS to prevent Windows ISP SRV ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported in environment
}

const mongoose = require('mongoose');

// Prevent unhandled error event from crashing the process
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected from MongoDB.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB.');
});

const DIRECT_FALLBACK_URI =
  'mongodb://al-barakah-society:LQTNgNGQx17nDc6i@ac-sbelmyf-shard-00-00.unhq3oq.mongodb.net:27017,ac-sbelmyf-shard-00-01.unhq3oq.mongodb.net:27017,ac-sbelmyf-shard-00-02.unhq3oq.mongodb.net:27017/al_barakah_society?ssl=true&replicaSet=atlas-88oqa5-shard-0&authSource=admin&retryWrites=true&w=majority';

const connectDB = async () => {
  let uri = process.env.MONGO_URI || DIRECT_FALLBACK_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection attempt failed: ${error.message}`);
    // If SRV or initial URI failed, try direct standard replica set URI fallback
    if (uri !== DIRECT_FALLBACK_URI) {
      try {
        console.log(`🔄 Attempting connection using direct replica-set fallback...`);
        const conn = await mongoose.connect(DIRECT_FALLBACK_URI, {
          serverSelectionTimeoutMS: 8000,
        });
        console.log(`✅ MongoDB Connected via Fallback: ${conn.connection.host} (${conn.connection.name})`);
        return;
      } catch (fallbackError) {
        console.error(`❌ Fallback MongoDB Connection Error: ${fallbackError.message}`);
      }
    }
    console.error(`💡 Tip: Check MongoDB Atlas Network Access (whitelist 0.0.0.0/0).`);
  }
};

module.exports = connectDB;
