import HomeController from "../controllers/home-controller";
import authenticationMiddleware from "../middleware/authentication-middleware";
import loggerMiddleware from "../middleware/logger-middleware";
import express from "express";
const authenticationRouterMiddleware = express.Router();
authenticationRouterMiddleware.use(authenticationMiddleware);
authenticationRouterMiddleware.use(loggerMiddleware);
authenticationRouterMiddleware.get("/home", HomeController.welcome);
export { authenticationRouterMiddleware };
