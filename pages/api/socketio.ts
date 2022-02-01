import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  if (!res.socket!.server.io) {
    console.log("*First use, starting socket.io");

    // @ts-ignore
    const io = new Server(res.socket!.server);

    // io.on("connection", (socket) => {
    //   socket.broadcast.emit("a user connected");
    // });
    // @ts-ignore

    res.socket!.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
