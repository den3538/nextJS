import { MongoClient } from 'mongodb';
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI){ throw new Error('Please define the MONGODB_URI environment variable'); }

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // allow global `var` declarations
  var mongooseCache: MongooseCache | undefined;
}

const mongooseCached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if(!global.mongooseCache){
    global.mongooseCache = mongooseCached;
}


async function dbConnect() {
    if(mongooseCached.conn){
        return mongooseCached.conn
    }

    if(!mongooseCached.promise){
        const opts = {
            bufferCommands: false,
        }

        if (!MONGODB_URI) {
            throw new Error('Please define the MONGODB_URI environment variable');
        }

        mongooseCached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        })
    }

    try {
        mongooseCached.conn = await mongooseCached.promise;
    } catch (error) {
        mongooseCached.promise = null;
        throw error;
    }

    return mongooseCached.conn;
}


const client = new MongoClient(MONGODB_URI);
const db = client.db();

 export { db, client, dbConnect };