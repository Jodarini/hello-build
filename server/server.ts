import express from "express";
import fs from "fs";
import cors from "cors"; // Import cors
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user/:name", (req, res) => {
  const userName = req.params.name;
  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    const users = JSON.parse(data);
    const user = users.find((u) => u.name === userName);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(user);
  });
});

app.post("/createUser", (req, res) => {
  const newUser = req.body;
  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }
    const users = JSON.parse(data);
    const newId = users.length + 1;
    newUser.id = newId;
    users.push(newUser);

    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error writing file" });
      }
      res.status(201).json(newUser);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
