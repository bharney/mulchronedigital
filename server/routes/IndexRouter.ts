import { Router } from "express";
import HomeIndexRouter from "./home/HomeIndexRouter";
import UserDashboardRouterIndex from "./user-dashbord/UserDashboardIndexRouter";
import AdminDashboardIndexRouter from "./admin-dashboard/AdminDashboardIndexRouter";
import { UserAuthenicationRouter } from "./users/UserAuthenicationRouter";

export class IndexRouter {
  public router: Router;
  public userAuthenicationRouter: Router;
  public userDashboardRouter: Router;
  public homeRouter: Router;
  public adminDashboardRouter: Router;

  constructor() {
    this.router = Router();
    this.createSubRouters();
    this.configureRoutes();
  }

  private createSubRouters() {
    this.userAuthenicationRouter = new UserAuthenicationRouter().router;
    this.userDashboardRouter = new UserDashboardRouterIndex().router;
    this.homeRouter = new HomeIndexRouter().router;
    this.adminDashboardRouter = new AdminDashboardIndexRouter().router;
  }

  private configureRoutes() {
    this.router.use("/api/userauth", this.userAuthenicationRouter);
    this.router.use("/api/userdashboard", this.userDashboardRouter);
    this.router.use("/api/home", this.homeRouter);
    this.router.use("/api/admindashboard", this.adminDashboardRouter);
  }
}
