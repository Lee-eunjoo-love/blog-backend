/**
 * 컨트롤러 : 라우트 처리 함수를 별도 파일로 분리해서 관리하는 파일
 *
 * exports.함수명 : 컨트롤러 함수 내보내기
 *
 * [사용방법]
 * const 모듈명 = require('컨트롤러 파일명)
 * 모듈명.함수명();
 */
import Member from "../../models/member.js";
import mongoose from "mongoose";
import Joi from "joi";

const { ObjectId } = mongoose.Types;

/**
 * [미들웨어] 유효한 ID 이면, 해당 ID 의 정보를 현재 요청 컨텍스트의 상태 정보에 담는 기능을 담당하는 미들웨어
 */
export const getMemberById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // #. Bad Request
    return;
  }

  // #. 검증된 식별자 정보가 존재하면 현재 요청 컨텍스트의 상태 정보에 담기
  try {
    const member = await Member.findById(id);
    if (!member) {
      ctx.status = 404; // #. Not Found
      return;
    }
    ctx.state.member = member;

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * [미들웨어] 로그인 사용자가 해당 정보의 작성자인지 여부를 검증하는 기능을 담당하는 미들웨어
 */
export const checkOwnMember = (ctx, next) => {
  const { user, member } = ctx.state;
  if (member.user._id.toString() !== user._id) {
    ctx.status = 403; // #. Forbidden 권한 없음
    return;
  }

  return next();
};

/**
 * [POST] /api/band
 */
export const write = async (ctx) => {
  // #. Request Body 검증 (데이터형 및 필수항목 검증)
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    role: Joi.string().required(),
    photo: Joi.string().required(),
    desc: Joi.string(),
    insta: Joi.string(),
    facebook: Joi.string(),
    youtube: Joi.string(),
  });
  const validRequestBody = schema.validate(ctx.request.body);
  if (validRequestBody.error) {
    ctx.status = 400; //#. Bad Request
    ctx.body = validRequestBody.error;
    return;
  }

  // #. 검증된 데이터 등록
  const { name, role, photo, desc, insta, facebook, youtube } =
    ctx.request.body;
  const member = new Member({
    name,
    role,
    photo,
    desc: desc || "",
    insta: insta || "",
    facebook: facebook || "",
    youtube: youtube || "",
    user: ctx.state.user,
  });

  try {
    await member.save();
    ctx.body = member;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * [GET] /api/band
 */
export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400; // #. Bad Request
    return;
  }

  // #. 필터링 정보 { name, role }
  const { name, role, username } = ctx.query;
  const query = {
    ...(name ? { name } : {}),
    ...(role ? { role } : {}),
    ...(username ? { "user.username": username } : {}),
  };

  try {
    const members = await Member.find(query) //
      .sort({ _id: -1 }) // #. { key: 정렬순서(1: 순서, -1: 역순) }
      .limit(10)
      .skip((page - 1) * 10)
      .lean() // #. map(member) => member.toJSON() 대체. 데이터를 처음부터 JSON 형태로 조회.
      .exec();
    const memberCount = await Member.countDocuments(query).exec();
    ctx.set("Last-Page", Math.ceil(memberCount / 10));
    ctx.body = members //
      //.map((member) => member.toJSON()) // #.learn() 으로 대체.
      .map((member) => ({
        ...member,
        desc:
          member.desc.length < 200
            ? member.desc
            : `${member.desc.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * [GET] /api/band/:id
 */
export const read = (ctx) => {
  ctx.body = ctx.state.member;
};

/**
 * [DELETE] /api/band/:id
 */
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    const index = await Member.findByIdAndDelete(id).exec();
    ctx.status = 204; // #. Not Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * [PATCH] /api/band/:id
 */
export const update = async (ctx) => {
  // #. Request Body 검증 (데이터형 검증)
  const schema = Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    photo: Joi.string(),
    desc: Joi.string(),
    insta: Joi.string(),
    facebook: Joi.string(),
    youtube: Joi.string(),
  });
  const validRequestBody = schema.validate(ctx.request.body);
  if (validRequestBody.error) {
    ctx.status = 400; // #. Bad Request
    ctx.body = validRequestBody.error;
    return;
  }

  // #. 현재 요청 컨텍스트 정보로 업데이트
  const { id } = ctx.params;
  try {
    const member = await Member.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!member) {
      ctx.status = 404; // #. Not Found
      return;
    }
    ctx.body = member;
  } catch (e) {
    ctx.throw(500, e);
  }
};
