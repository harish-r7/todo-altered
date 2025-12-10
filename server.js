const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // load .env

const app = express();
app.use(express.json());
app.use(cors());

// get values from env (with fallbacks)
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mern-app";
const port = process.env.PORT || 8000;

// connect Mongo
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

// schema + model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

const Todo = mongoose.model("todo", todoSchema);

// create
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get all
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// update
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// delete
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Todo.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log("server is listening to port " + port);
});
