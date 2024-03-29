const http = require("http");
const app = require("./app");
const NotifCtrl = require("./notification/controller/notificationController");
const Notification=require('./notification/model/notification');

const normalizePort = (val) => {
  const portNormalized = parseInt(val, 10);

  if (isNaN(portNormalized)) {
    return val;
  }
  if (portNormalized >= 0) {
    return portNormalized;
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
setInterval(()=>{ NotifCtrl.nearbyEvents() }, 86400000);
setInterval(()=>{ NotifCtrl.personNotRenwal() }, 604800000);
io.on("connection", (socket) => {
  console.log("Socket: client connected", socket.id);
  socket.on("action", (message, idAction) => {
    socket.broadcast.emit(idAction + "", message);
  });
  socket.on("action:typing", (user, message, idAction) => {
    socket.broadcast.emit(idAction + ":typing", user, message);
  });
  socket.on("adminNewEvent", (data) => {
    Notification.find({
      uniqueEventIdInSocket:data
    }).then((notifications)=>{
      notifications.forEach((el)=>{
        socket.broadcast.emit("newEvent"+el.receiver._id,el);
      });
    }).catch(err=>{
      console.log(err);
    });    
  });
});

server.listen(port);
