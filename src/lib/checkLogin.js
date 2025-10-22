/**
 * [ 로그인 검증 미들웨어 ]
 * 라우터 미들웨어 적용 전에 app 에 적용 필요
 */

const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = 401; // #. Unauthorized
    return;
  }

  return next();
};

export default checkLoggedIn;
