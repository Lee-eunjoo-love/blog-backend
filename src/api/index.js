const Router = require("koa-router");
const api = new Router();
const posts = require("./posts");

api.get("/test", (ctx) => {
  ctx.body = "test 성공";
});

api.use("/posts", posts.routes());

// #. 라우터 내보내기
module.exports = api;
