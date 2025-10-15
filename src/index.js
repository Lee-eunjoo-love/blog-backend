const Koa = require("koa");

const app = new Koa(); // #. Koa 애플리케이션은 미들웨어((ctx, next) => {})의 배열로 구성되어 있음. app.use()를 사용해 등록된 순서대로 미들웨어 실행.

// #. app.use() : 미들웨어 함수를 애플리케이션에 등록. ctx(Context): 웹 요청/응답 정보, next: 현재 처리중인 미들웨어 다음에 호출할 미들웨어
app.use((ctx) => {
  ctx.body = "hello world!!!";
});

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
