import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let isConnected = false;
let useLocalFallback = false;
const LOCAL_DB_PATH = path.resolve('local_db.json');

// Initialize local JSON file if it doesn't exist
const initLocalDb = () => {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ users: [], resumes: [], sessions: [] }, null, 2));
    console.log('⚡ Local JSON Database initialized at:', LOCAL_DB_PATH);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('⚠️ No MONGODB_URI found in env. Switching to Local JSON Database fallback...');
    useLocalFallback = true;
    initLocalDb();
    return false;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    isConnected = true;
    useLocalFallback = false;
    console.log(`🚀 MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ Falling back to Local JSON Database...');
    useLocalFallback = true;
    initLocalDb();
    return false;
  }
};

export const getDbStatus = () => {
  return {
    connected: isConnected,
    mode: useLocalFallback ? 'JSON-Fallback' : 'MongoDB',
    path: useLocalFallback ? LOCAL_DB_PATH : null
  };
};

export { useLocalFallback, LOCAL_DB_PATH };
