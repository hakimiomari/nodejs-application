// const http = require("http");
// const server = http.createServer((req, res) => {
//   (res.statuscode = 200),
//     (res.setHeader = ("Context-Type", "text/plain")),
//     res.end("Hello Node Js ");
// });
// server.listen(5000, "127.0.0.1", () => {
//   console.log("server running ....");
// });
const { v4: uuid } = require("uuid");
// import { v4 as uuid } from "uuid";
console.log(uuid());
