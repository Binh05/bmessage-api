import { env } from "./environment.js";
import mongoose from "mongoose";

async function CONNECT_DB() {
  try {
    await mongoose.connect(env.MONGODB_URI, { dbName: env.DATABASE_NAME });
    console.log("Ket noi database thanh cong");
  } catch (error) {
    console.log("Loi khi ket noi database", error);
    process.exit(1);
  }
}

async function CLOSE_DB() {
  try {
    await mongoose.connection.close();
    console.log("Mongo connection closed");
  } catch (error) {
    console.log("loi khi ngat ket noi db ", error);
  }
}

export { CONNECT_DB, CLOSE_DB };
