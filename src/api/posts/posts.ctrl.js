/**
 * 컨트롤러 : 라우트 처리 함수를 별도 파일로 분리해서 관리하는 파일
 *
 * exports.함수명 : 컨트롤러 함수 내보내기
 *
 * [사용방법]
 * const 모듈명 = require('컨트롤러 파일명)
 * 모듈명.함수명();
 */
import Post from "../../models/post.js";
import mongoose from "mongoose";
import Joi from "joi";
/*let postId = 1; // #. 초기값

const posts = [
  {
    id: 1,
    title: "제목",
    body: "내용",
  },
];*/

const { ObjectId } = mongoose.Types;
/**
 * [미들웨어] 유효한 ID 이면, 해당 ID 의 정보를 현재 요청 컨텍스트의 상태 정보에 담는 기능을 담당하는 미들웨어.
 */
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // #. Bad Request
    return;
  }

  // #. 검증된 식별자 정보가 존재하면 현재 요청 컨텍스트의 상태 정보에 담기
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404; //#. Not Found
      return;
    }
    ctx.state.post = post;

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * [미들웨어] 로그인 사용자가 해당 포스트의 작성자인지 여부를 검증하는 기능을 담당하는 미들웨어
 */
export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403; // #. Forbidden 권한 없음
    return;
  }

  return next();
};

/**
 * POST /api/posts
 */
//exports.write = (ctx) => {
/*export const write = (ctx) => {
  // #. REST API 의 Request Body는 ctx.request.body 에서 조회 가능
  const { title, body } = ctx.request.body;
  postId += 1;
  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};*/
export const write = async (ctx) => {
  // #. Request Body 검증 (데이터형 및 필수항목 검증)
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });
  const validRequestBody = schema.validate(ctx.request.body);
  if (validRequestBody.error) {
    ctx.status = 400; // #. Bad Request
    ctx.body = validRequestBody.error;
    return;
  }

  // #. 검증된 데이터 등록
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, 0);
  }
};

/**
 * GET /api/posts
 */
//exports.list = (ctx) => {
/*export const list = (ctx) => {
  ctx.body = posts;
};*/
export const list = async (ctx) => {
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400; // #. Bad Request
    return;
  }

  // #. 필터링 정보 { username, tags }
  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { "user.username": username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query) //
      .sort({ _id: -1 }) // #. { key : 정렬순서(1: 순차, -1: 역순) }
      .limit(10)
      .skip((page - 1) * 10)
      .lean() // #. map((post) => post.toJSON()) 대체. 데이터를 처음부터 JSON 형태로 조회.
      .exec();
    const postCount = await Post.countDocuments(query).exec();
    ctx.set("Last-Page", Math.ceil(postCount / 10));
    ctx.body = posts //
      //.map((post) => post.toJSON()) // #. learn() 으로 대체.
      .map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * GET /api/posts/:id
 */
//exports.read = (ctx) => {
/*export const read = (ctx) => {
  const { id } = ctx.params;
  // #. 파라미터로 받아 온 값은 문자열이므로 동일한 데이터형으로 변환 필요
  const post = posts.find((p) => p.id.toString() === id);
  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  ctx.body = post;
};*/
/*export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // #. Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};*/
export const read = (ctx) => {
  ctx.body = ctx.state.post;
};

/**
 * DELETE /api/posts/:id
 */
//exports.remove = (ctx) => {
/*export const remove = (ctx) => {
  const { id } = ctx.params;
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.stataus = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  posts.splice(index, 1);
  ctx.status = 204; // #. No Content
};*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    const index = await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // #. No Content
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * PUT /api/posts/:id
 * @param { title, body} ctx
 */
//exports.replace = (ctx) => {
/*export const replace = (ctx) => {
  const { id } = ctx.params;
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다",
    };
    return;
  }
  // #. PUT: id 를 제외한 모든 값을 대체. 일부 필드만 변경시 request.body 에 없는 항목은 삭제되므로 모든 필드가 있는지 검증 필요.
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};*/

/**
 * PATCH /api/posts/:id
 */
//exports.update = (ctx) => {
/*export const update = (ctx) => {
  const { id } = ctx.params;
  const index = posts.findIndex((p) => p.id.toString() === id);
  console.log(id, index);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  // #. PATCH : 기존 값을 유지하면서 변경된 값만 업데이트
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};*/
export const update = async (ctx) => {
  // #. Request Body 검증 (대이터형 검증)
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
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
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!post) {
      ctx.status = 404; // #. Bad Request
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
