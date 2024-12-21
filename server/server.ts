import express from "express";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
const port = 3000;
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from your frontend
app.use(express.json());

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

app.get("/user/:name", (req, res) => {
  const userName = req.params.name;
  fs.readFile("./server/users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    const users = JSON.parse(data);
    const user = users.find(
      (u: { id: string; name: string }) => u.name === userName,
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(user);
  });
});

app.get("/login/:name", (req, res) => {
  const username = req.params.name;
  fs.readFile("./server/users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    const users = JSON.parse(data);
    const user = users.find(
      (u: { id: string; name: string }) => u.name === username,
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const link = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=http://localhost:5173/auth&login=${username}`;

    return res.json({ url: link });
  });
});

app.post("/createUser", (req, res) => {
  const newUser = req.body;
  fs.readFile("./server/users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }
    const users = JSON.parse(data);
    const userAlreadyExist = users.find(
      (u: { id: string; name: string }) =>
        u.name.toLowerCase() === newUser.name.toLowerCase(),
    );
    if (userAlreadyExist) {
      return res.status(409).json({ error: "User already exists" });
    }
    const newId = users.length;
    newUser.id = newId;
    users.push(newUser);

    fs.writeFile("./server/users.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error writing file" });
      }
      res
        .status(201)
        .json({ message: "User created successfully", userId: newId });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
