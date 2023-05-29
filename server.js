const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaughtException error. shutting down...");
  process.exit(1);
});

const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is successful"));

const port = process.env.PORT || 3005;
const server = app.listen(port, () => {
  console.log(`app is running on port ${port}...`);
});

process.on("unhandleRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLE REJECTION. shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
