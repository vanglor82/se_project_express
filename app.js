const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { createUser, loginUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { getItems } = require("./controllers/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.post("/signin", loginUser);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use(auth);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`listening to server ${PORT}`);
});

