import { verifySignUp } from "../middlewares";
import { signin, signup } from "../controllers/auth.controller";

export default function (app: any) {
  app.use(function (req: any, res: any, next: any) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    signup
  );

  app.post("/api/auth/signin", signin);
}
