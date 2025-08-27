const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { requestLogger } = require("./middlewares/logger");
require("dotenv").config();

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");
const { errorLogger } = require("express-winston");

const app = express();
const {
  PORT = 3001,
  DB_ADDRESS = "mongodb://127.0.0.1:27017/wtwr_db",
} = process.env;

app.disable("x-powered-by");

app.use(
  express.json({
    strict: true,
    limit: "1mb",
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const error = new Error("Invalid JSON payload.");
    error.statusCode = 400;
    return next(error);
  }
  return next(err);
});

app.use(cors());


app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger);

app.use(errorHandler);

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`listening to server ${PORT}`);
});