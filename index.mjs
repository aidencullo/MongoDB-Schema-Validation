import express from "express";
import db from "./db/conn.mjs";
import { ObjectId } from "mongodb";

const PORT = 5050;
const app = express();

app.use(express.json());

// Get the current validation rules.
app.get("/", async (req, res) => {
  let coll = await db.listCollections({ name: "learners" }).toArray();
  const result = coll[0].options.validator;

  res.send(result).status(204);
});

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
