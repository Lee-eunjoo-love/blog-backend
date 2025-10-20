import Router from "koa-router"; //const Router = require("koa-router");
import posts from "./posts/index.js"; //const posts = require("./posts");

const api = new Router();
/*api.get("/test", (ctx) => {
  ctx.body = "test 성공";
});*/

api.use("/posts", posts.routes());

// #. 라우터 내보내기
export default api; //module.exports = api;
