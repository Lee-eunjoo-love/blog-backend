/**
 * 컨트롤러 : 라우트 처리 함수를 별도 파일로 분리해서 관리하는 파일
 *
 * exports.함수명 : 컨트롤러 함수 내보내기
 *
 * [사용방법]
 * const 모듈명 = require('컨트롤러 파일명)
 * 모듈명.함수명();
 */

let postId = 1; // #. 초기값

const posts = [
  {
    id: 1,
    title: "제목",
    body: "내용",
  },
];

/**
 * POST /api/posts
 * @param { title, body} ctx
 */
exports.write = (ctx) => {
  // #. REST API 의 Request Body는 ctx.request.body 에서 조회 가능
  const { title, body } = ctx.request.body;
  postId += 1;
  const post = { id: postId, title, body };
  posts.put(post);
  ctx.body = post;
};

/**
 * GET /api/posts
 * @param {*} ctx
 */
exports.list = (ctx) => {
  ctx.body = posts;
};

/**
 * GET /api/posts/:id
 */
exports.read = (ctx) => {
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
};

/**
 * DELETE /api/posts/:id
 */
exports.remove = (ctx) => {
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
};

/**
 * PUT /api/posts/:id
 * @param { title, body} ctx
 */
exports.replace = (ctx) => {
  const { id } = ctx.params;
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다",
    };
    return;
  }
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};

/**
 * PATCH /api/posts/:id
 * @param { title, body} ctx
 */
exports.update = (ctx) => {
  const { id } = ctx.params;
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: "포스트가 존재하지 않습니다.",
    };
    return;
  }
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};
