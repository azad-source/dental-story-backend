require("dotenv").config({ path: __dirname + "/.env" });
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import log from "winston";
import dbInfo from "./models";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

mongoose.set("strictQuery", true);

const env = process.env.NODE_ENV || process.env.APP_ENV;
const isDev = env === "development";
const isProd = env === "production";

// log.info('APP_ENV:'+process.env['APP_ENV']);

/** Server */
const domain = process.env.SERVER_DOMAIN;
const port = process.env.SERVER_PORT;
const apiRoot = "/api/dental-story";

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

const Role = dbInfo.role;

mongoose
  .connect(mongoUrl, dbConfig)
  .then(() => {
    console.log("DB Connection Established!");
    initial();
  })
  .catch((err: any) => {
    console.log(err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err: any, count: number) => {
    if (!err && count === 0) {
      dbInfo.ROLES.forEach((role) => {
        new Role({ name: role }).save((err: any) => {
          if (err) console.log("error", err);
          console.log(`added ${role} to roles collection`);
        });
      });
    }
  });
}

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(apiRoot, authRoutes, userRoutes);
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
