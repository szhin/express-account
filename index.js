const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const db = require("./src/config/db");

const port = process.env.REACT_APP_PORT || 8080;
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.connect();

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
