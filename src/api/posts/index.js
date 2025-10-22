import Router from "koa-router"; //const Router = require("koa-router");
import * as postsCtrl from "./posts.ctrl.js"; //const postsCtrl = require("./posts.ctrl");
import checkLoggedIn from "../../lib/checkLogin.js";

const posts = new Router();

/*const printInfo = (ctx) => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params,
  };
};

posts.get("/", printInfo);
posts.post("/", printInfo);
posts.get("/:id", printInfo);
posts.delete("/:id", printInfo);
posts.put("/:id", printInfo);
posts.patch("/:id", printInfo);*/

posts.get("/", postsCtrl.list);
posts.post("/", checkLoggedIn, postsCtrl.write);
posts.get("/:id", postsCtrl.getPostById, postsCtrl.read);
posts.delete(
  "/:id",
  checkLoggedIn,
  postsCtrl.getPostById,
  postsCtrl.checkOwnPost,
  postsCtrl.remove
);
//posts.put("/:id", postsCtrl.replace);
posts.patch(
  "/:id",
  checkLoggedIn,
  postsCtrl.getPostById,
  postsCtrl.checkOwnPost,
  postsCtrl.update
);

export default posts; //module.exports = posts;
