import Router from "koa-router"; //const Router = require("koa-router");
import posts from "./posts/index.js"; //const posts = require("./posts");
import auth from "./auth/index.js";
import band from "./band/index.js";

const api = new Router();
/*api.get("/test", (ctx) => {
  ctx.body = "test 성공";
});*/

api.use("/posts", posts.routes());
api.use("/band", band.routes());
api.use("/auth", auth.routes());

// #. 라우터 내보내기
export default api; //module.exports = api;
