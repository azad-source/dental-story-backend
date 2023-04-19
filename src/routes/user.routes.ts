import { Express } from "express";
import { isAdmin, isSuperUser, verifyToken } from "../middlewares/authJwt";
import {
  allAccess,
  dentistBoard,
  superUserBoard,
  adminBoard,
} from "../controllers/user.controller";

export const userRoutes = (app: Express) => {
  app.use(function (req, res, next) {
    res.setHeader("content-type", "application/json");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", allAccess);

  app.get("/api/test/dentist", [verifyToken], dentistBoard);

  app.get("/api/test/super-user", [verifyToken, isSuperUser], superUserBoard);

  app.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);
};
