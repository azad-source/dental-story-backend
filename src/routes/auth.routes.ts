import { signin, signup } from "../controllers/auth.controller";
import { Express } from "express";
import { checkExistRoles, checkExistUser } from "../middlewares/verifySignUp";

export const authRoutes = (app: Express) => {
  app.use(function (req, res, next) {
    res.setHeader("content-type", "application/json");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup", [checkExistUser, checkExistRoles], signup);

  app.post("/api/auth/signin", signin);
};
