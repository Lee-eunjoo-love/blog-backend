//require("dotenv").config();
//const Koa = require("koa");
//const Router = require("koa-router");
//const bodyParser = require("koa-bodyparser"); // #. router 적용 코드 윗부분에서 로드 필요
//const mongoose = require("mongoose");

import "dotenv/config"; //require("dotenv").config();
import Koa from "koa"; //const Koa = require("koa");
import Router from "koa-router"; //const Router = require("koa-router");
import bodyParser from "koa-bodyparser"; //const bodyParser = require("koa-bodyparser"); // #. router 적용 코드 윗부분에서 로드 필요
import mongoose from "mongoose"; //const mongoose = require("mongoose");
import api from "./api/index.js"; //const api = require("./api");

// [MongoDB]
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

const api = require("./api");

// #. Koa 애플리케이션은 미들웨어((ctx, next) => {})의 배열로 구성되어 있음. app.use()를 사용해 등록된 순서대로 미들웨어 실행.
const app = new Koa();
const router = new Router();

// #. app.use() : 미들웨어 함수를 애플리케이션에 등록. ctx(Context): 웹 요청/응답 정보, next: 현재 처리중인 미들웨어 다음에 호출할 미들웨어(Promise 를 반환하며 Promise 는 다음에 처리해야 할 미들웨어가 끝나야 완료됨).
/*app.use((ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authorized !== "1") {
    ctx.status = 401; // Unauthorized
    return;
  }
  next().then(() => {
    // #. next() 가 반환한 Promise 는 다음에 처리할 미들웨어가 끝난후 완료됨.
    console.log("END");
  });
});*/
// #. [Koa async/await 지원] async/await 사용하기
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  /*if (ctx.query.authorized !== "1") {
    ctx.status = 401; // Unauthorized
    return;
  }*/
  await next();
  // #. next() 가 반환한 Promise 는 다음에 처리할 미들웨어가 끝난후 완료됨.
  console.log("END");
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

/*app.use((ctx) => {
  console.log(3);
  ctx.body = "hello world!!!";
});*/

// #. 라우터 설정 : router.get("라우트 경로", "적용할 미들웨어 함수") :
//                HTTP 메서드 : get/post/put/delete
router.get("/", (ctx) => {
  ctx.body = "홈";
});

// #. 파라미터 : 카테고리나 고유식별자 등의 특정 데이터 조회시 사용
router.get("/about/:name", (ctx) => {
  const { name } = ctx.params;
  ctx.body = name ? `${name} 의 소개` : "소개";
});

// #. 쿼리 : 옵션 관련 정보
router.get("/posts", (ctx) => {
  const { id } = ctx.query;
  ctx.body = id ? `포스트 #${id}` : "포스트 아이디가 없습니다.";
});

// #. 기존 라우터에 '/api' 경로 적용
router.use("/api", api.routes());

// #. bodyParser 는 라우터 적용 전에 등록
app.use(bodyParser());

// #. app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log("Listening to port %d", port);
});
