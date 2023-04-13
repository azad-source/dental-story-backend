require('dotenv').config({ path: __dirname + '/.env' })
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const RecipeRoute = require("./routes/recipe");
const log = require('winston');

const env = process.env.NODE_ENV || process.env.APP_ENV;
const isDev = env === "development";
const isProd = env === "production";

// log.info('APP_ENV:'+process.env['APP_ENV']);

/** Server */
const domain = process.env.SERVER_DOMAIN;
const port = process.env.SERVER_PORT;
const apiRoot = "/api/recipe";

/** Database */
const dbName = process.env.DATABASE_NAME;
const dbUser = process.env.DATABASE_USER;
const dbPass = process.env.DATABASE_PASS;
const mongoUrl = `mongodb://${domain}:27017/${dbName}`;

let dbConfig = {};

if (isProd) {
  dbConfig = {
    dbName,
    user: dbUser,
    pass: dbPass,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
}

mongoose
  .connect(mongoUrl, dbConfig)
  .then(() => {
    console.log("DB Connection Established!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(apiRoot, RecipeRoute);
app.use(express.static("public"));

// Starting both http & https servers
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});

if (!isDev) {
  // ----------------- STARTING HTTPS (443) -----------------------------
  // Certificate
  const privateKey = `/etc/letsencrypt/live/${domain}/privkey.pem`;
  const certificate = `/etc/letsencrypt/live/${domain}/cert.pem`;
  const ca = `/etc/letsencrypt/live/${domain}/chain.pem`;

  const credentials = {
    key: fs.readFileSync(privateKey, "utf8"),
    cert: fs.readFileSync(certificate, "utf8"),
    ca: fs.readFileSync(ca, "utf8"),
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });
}
