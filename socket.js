import { io } from "socket.io-client";

// const URL = "https://socket-io-server-8mp0.onrender.com";
const URL = "http://localhost:3001";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
