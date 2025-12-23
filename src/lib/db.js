import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

export async function connectDB() {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect()
        .then((client) => {
          console.log(">>> [DB] Successfully connected to MongoDB");
          return client;
        })
        .catch((err) => {
          console.error(">>> [DB] Connection failed:", err.message);
          global._mongoClientPromise = null; // Clear so next call retries
          throw err;
        });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, we still use a singleton but with error handling
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect()
        .catch((err) => {
          clientPromise = null; // Clear on error
          throw err;
        });
    }
  }

  try {
    const dbClient = await clientPromise;
    return dbClient.db("carecircleDB");
  } catch (error) {
    throw error;
  }
}
