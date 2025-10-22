/**
 * 컨트롤러 : 라우트 처리 함수를 별도 파일로 분리해서 관리하는 파일
 *
 * exports.함수명 : 컨트롤러 함수 내보내기
 *
 * [사용방법]
 * const 모듈명 = require('컨트롤러 파일명)
 * 모듈명.함수명();
 */
import Joi from "joi";
import User from "../../models/user.js";

// #. 회원 가입
export const register = async (ctx) => {
  // #. Request Body 검증 (데이터형 및 필수항목)
  const schema = Joi.object().keys({
    username: Joi.string() //
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string() //
      .required(),
  });
  const valid = schema.validate(ctx.request.body);
  if (valid.error) {
    ctx.status = 400; // #. Bad Request
    ctx.body = valid.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // #. Conflict
      return;
    }

    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();

    ctx.body = await user.serialize();

    // #. 토큰 발급
    const token = await user.generateToken();
    ctx.cookies.set(process.env.JWT_ACCESS, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // #. 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// #. 로그인 처리
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; // #. Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = await user.serialize();

    // #. 토큰 발급
    const token = await user.generateToken();
    ctx.cookies.set(process.env.JWT_ACCESS, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // #. 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

// #. 로그인 상태 확인
export const check = async (ctx) => {
  const { user } = await ctx.state;
  if (!user) {
    ctx.status = 401; // #. Unauthorized
    return;
  }
  ctx.body = user;
};

// #. 로그아웃 처리
export const logout = async (ctx) => {
  await ctx.cookies.set(process.env.JWT_ACCESS);
  ctx.status = 204; // #. No Content
};
