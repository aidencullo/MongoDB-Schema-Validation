import express from "express";
import db from "./db/conn.mjs";
import { ObjectId } from "mongodb";

const PORT = 5050;
const app = express();

app.use(express.json());

// Create Collection with Schema Validation
// We're wrapping ours in a function to prevent it
// from being called again, since we've already
// created this collection.
async () => {
  await db.createCollection("learners", {
    // Pass the validator object
    validator: {
      // Use the $jsonSchema operator
      $jsonSchema: {
        bsonType: "object",
        title: "Learner Validation",
        // List required fields
        required: ["name", "enrolled", "year", "campus"],
        // Properties object contains document fields
        properties: {
          name: {
            // Each document field is given validation criteria
            bsonType: "string",
            // and a description that is shown when a document fails validation
            description: "'name' is required, and must be a string",
          },
          enrolled: {
            bsonType: "bool",
            description: "'enrolled' status is required and must be a boolean",
          },
          year: {
            bsonType: "int",
            minimum: 1995,
            description:
              "'year' is required and must be an integer greater than 1995",
          },
          avg: {
            bsonType: "double",
            description: "'avg' must be a double",
          },
          campus: {
            enum: [
              "Remote",
              "Boston",
              "New York",
              "Denver",
              "Los Angeles",
              "Seattle",
              "Dallas",
            ],
            description: "Invalid campus location",
          },
        },
      },
    },
  });
};

// Test the schema validation by inserting an invalid document
app.get("/", async (req, res) => {
  let collection = await db.collection("learners");
  let newDocument = {
    name: "Frodo",
    enrolled: true,
    year: 2024,
    campus: "The Shire",
  };

  let result = await collection.insertOne(newDocument).catch((e) => {
    return e.errInfo.details.schemaRulesNotSatisfied;
  });
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
