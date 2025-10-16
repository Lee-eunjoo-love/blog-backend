const Koa = require("koa");

// #. Koa 애플리케이션은 미들웨어((ctx, next) => {})의 배열로 구성되어 있음. app.use()를 사용해 등록된 순서대로 미들웨어 실행.
const app = new Koa();

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
  if (ctx.query.authorized !== "1") {
    ctx.status = 401; // Unauthorized
    return;
  }
  await next();
  // #. next() 가 반환한 Promise 는 다음에 처리할 미들웨어가 끝난후 완료됨.
  console.log("END");
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

app.use((ctx) => {
  console.log(3);
  ctx.body = "hello world!!!";
});

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
