const http = require("http");
const app = require("./app");
const NotifCtrl = require("./notification/controller/notificationController");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);


server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Socket Layer over Http Server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// On every Client Connection
setInterval(()=>{ NotifCtrl.nearbyEvents() }, 3000);
//setInterval(()=>{ NotifCtrl.personNotRenwal() }, 300000);
io.on("connection", (socket) => {
  console.log("Socket: client connected", socket.id);
  socket.on("action", (message, idAction) => {
    socket.broadcast.emit(idAction + "", message);
  });
  socket.on("action:typing", (user, message, idAction) => {
    socket.broadcast.emit(idAction + ":typing", user, message);
  });
  //notification
  socket.on("nour", (data) => {
    console.log("nour envoyer",data)
  });
  socket.on("adminNewEvent", (data) => {
    io.emit("newEvent",data)
  });
});

server.listen(port);
