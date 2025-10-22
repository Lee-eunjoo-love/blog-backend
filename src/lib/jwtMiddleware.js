/**
 * [ 토큰 검증 미들웨어 ]
 * 라우터 미들웨어 적용 전에 app 에 적용 필요
 */
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get(process.env.JWT_ACCESS);

  if (!token) return next();

  try {
    // #. 요청 컨텍스트의 상태 정보에 토큰으로부터 가져온 사용자 정보 설정
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    // #. 토큰 유효기간이 3.5일 미만이면 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      ctx.cookies.set(process.env.JWT_ACCESS, token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }

    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
