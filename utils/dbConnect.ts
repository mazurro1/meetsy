import mongoose, { ConnectOptions } from "mongoose";

interface ConnectionProps {
  isConnected?: number;
}

const connection: ConnectionProps = {};
async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(
    `mongodb+srv://${process.env.NEXT_PUBLIC_MONGO_USER_NAME}:${process.env.NEXT_PUBLIC_MONGO_USER_PASSWORD}@${process.env.NEXT_PUBLIC_MONGO_CLUSTER_NAME}.conmu.mongodb.net/${process.env.NEXT_PUBLIC_MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  );
  connection.isConnected = db.connections[0].readyState;
}
export default dbConnect;
