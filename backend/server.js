const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
const cors = require("cors");
var Pokedex = require("pokedex-promise-v2");
var P = new Pokedex();
const path = require("path");

app.use(cors());
app.use("/", express.static(path.resolve("./front")));
app.get("/", function (req, res) {
  // serve main path as static file
  res.sendFile(path.resolve("./front/index.html"));
});

const userRouter = require("./routers/userRouter");
app.use("/info", userRouter);
const pokemonRouter = require("./routers/pokemonRouter");
app.use("/pokemon", pokemonRouter);
app.use("/user", userRouter);

app.get("/type/:name", async function (req, res) {
  res.send(await P.getTypeByName(req.params.name));
});

// start the server
app.listen(port, function () {
  console.log(
    `app started listening on port ${port} visit us! http://localhost:8080`
  );
});
