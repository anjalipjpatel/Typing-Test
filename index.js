const express = require('express');
const fs = require("fs");
const port = 3000;
const app = express();

app.use(express.static(__dirname + "/public"));

"";

app.use(express.json());

app.post("/saveData", (req, res) => {
  const dataToAppend = req.body.data + "\n";
  fs.appendFile("testscores.txt", dataToAppend, err => {
    if (err) {
      console.error("Error appending to file: ", err);
      res.status(500).json({ error: "Error appending data" });
    } else {
      console.log("Data appended successfully");
      res.json({ success: true });
    }
  });
});

app.use(express.static(__dirname));

app.get('/getTestScores', (req, res) => {
  fs.readFile('testscores.txt', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file: ', err);
      res.status(500).json({ error: 'Error reading data' });
    } else {
      const dataArray = data.split('\n').filter(line => line.trim() !== '');
      res.json(dataArray);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});