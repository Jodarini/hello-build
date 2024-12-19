import express from "express";
import fs from "fs";
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
