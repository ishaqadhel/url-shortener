require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const urlparser = require("url");
const app = express();

/* Config */
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* Schema Mongoose */
const schema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: { type: String, unique: true },
});
const Url = mongoose.model("Url", schema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/new", function (req, res) {
  const originalUrl = req.body.originalUrl;
  const shortUrl = req.body.shortUrl;

  const something = dns.lookup(
    urlparser.parse(originalUrl, shortUrl).hostname,
    (error, address) => {
      if (!address) {
        res.json({ error: "Invalid URL" });
      } else {
        const url = new Url({ originalUrl: originalUrl, shortUrl: shortUrl });
        url.save((err) => {
          if (err) {
            res.json({error: "Short Url already taken"});
          } else {
            res.json({message: "Short Url Created Successfully"});
          }
        });
      }
    }
  );
});

app.get("/:url", (req, res) => {
  const short_url = req.params.url;
  Url.find(short_url, (err, data) => {
    if (!data) {
      res.json({ error: "Invalid URL" });
    } else {
      res.redirect(data.originalUrl);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
