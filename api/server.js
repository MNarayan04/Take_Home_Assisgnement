const app = require("express")();
const moment = require("moment");

const gridState = {},
  connected = [];

const gridSnapshots = {};

const server = app.listen(8080, () => {
  console.log("Server is up and running on 8080");
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      gridState[`${row}-${col}`] = null;
    }
  }
});

const io = require("socket.io")(server, {
  perMessageDeflate: false,
  cors: {
    origin: "*",
  },
});

function recordOrUpdateGridSnapshot(timestamp, update, io) {
  if (timestamp in gridSnapshots) {
    const existingSnapshot = gridSnapshots[timestamp];
    existingSnapshot.updates.push(update);
  } else {
    gridSnapshots[timestamp] = {
      updates: [update],
    };
  }

  io.emit("grid-history", gridSnapshots);
}

io.on("connection", (socket) => {
  connected.push(socket.id);
  io.emit("initial-state", gridState);
  io.emit("grid-history", gridSnapshots);

  io.emit("online-users", connected);
  socket.on("cell-selected", (data) => {
    const { row, col, unicodeCharacter } = data;
    const blockId = `${row}-${col}`;

    const regex = /\p{Any}/gu;
    if (!gridState[blockId] && regex.test(unicodeCharacter)) {
      gridState[blockId] = unicodeCharacter;

      io.emit("current-state", { row, col, unicodeCharacter });

      const currentTimestamp = moment().format("DD/MM/YY, h:mm:ss a");
      const update = { row, col, unicodeCharacter, id: socket.id };

      recordOrUpdateGridSnapshot(currentTimestamp, update, io);
    }
  });

  socket.on("disconnect", () => {
    connected.pop(socket.id);
    io.emit("online-users", connected);
  });
});
