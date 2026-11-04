require("dotenv").config();

const createApp = require("./app");
const PORT = Number(process.env.PORT) || 3000;
const server = createApp().listen(PORT, "0.0.0.0", () => {
  console.log(`BRUR QB API and web app listening on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server`);
  server.close(() => {
    const pool = require("./config/db");
    pool.end().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
