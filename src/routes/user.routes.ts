import { authJwt } from "../middlewares";
import {
  allAccess,
  dentistBoard,
  superUserBoard,
  adminBoard,
} from "../controllers/user.controller";
import { Express } from "express";

export default function (app: Express) {
  app.use(function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", allAccess);

  app.get("/api/test/dentist", [authJwt.verifyToken], dentistBoard);

  app.get(
    "/api/test/super-user",
    [authJwt.verifyToken, authJwt.isSuperUser],
    superUserBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    adminBoard
  );
}
