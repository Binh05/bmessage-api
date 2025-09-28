import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from './environment.js'

let appDatabaseInstance = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function CONNECT_DB() {
  await mongoClientInstance.connect();

  appDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
}

async function CLOSE_DB() {
  await mongoClientInstance.close();
}

function GET_DB() {
  if (!appDatabaseInstance) throw new Error("Must connect to Database first");
  return appDatabaseInstance;
}

export { CONNECT_DB, CLOSE_DB, GET_DB };

//116.111.185.110
//npm install mongodb
