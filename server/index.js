const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;  // PORT depends on environment, or 3001 if there is none

const app = express();

app.use(express.json());      // Allows incoming requests to be recognized as JSON objects
app.use(express.urlencoded({ extended: true }));        // Allows incoming HTML forms and URL-encoded data to be parsed
app.use(cors());              // Allows frontend to make requests to access the APIs here

app.post("/finished", function(req, res) {
  let mess = req.body;
  console.log(mess);
  res.json({message: "Hello"});
});

// Server will run on PORT
app.listen(PORT, function() {
  console.log(`Server listening on ${PORT}`);
});