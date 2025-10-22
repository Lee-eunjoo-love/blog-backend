import mongoose from "mongoose";

const { Schema } = mongoose;

// #. 스키마 정의
const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedData: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

// #. 모델 생성
const Post = mongoose.model("Post", PostSchema);
export default Post;

/**
 * [mongoose] 모델 : 스키마를 사용하여 만드는 인스턴스로, 데이터베이스에서 실제 작업을 처리할 수 있는 함수를 포함하고 있는 객체.
 *   mongoose.model(스키마명, 스키마객체) : 데이터베이스는 스키마명의 복수형태의 데이터베이스 컬렉션 이름을 생성.
 *                                       (복수형의 기본값을 따르고 싶지 않으면 세번째 인자에 'custom_book_collection' 을 전달하면 스키마명 그대로 데이터베이스에 컬렉션 생성)
 *
 * [mongoose] 스키마 : 컬렉션에 들어가는 문서 내부의 각 필드의 형식 정의 객체.
 *   1. String : 문자열
 *   2. Number : 숫자
 *   3. Date : 날짜
 *   4. Buffer : 파일을 담을 수 있는 버퍼
 *   5. Boolean : true/false
 *   6. Mixed(Schema.Types.Mixed) : 어떤 데이터도 넣을 수 있는 형식
 *   7. ObjectId(Schema.Types.Object) : 객체 식별자. 주로 다른 객체를 참조할 때 넣음
 *   8. Array : 배열 형태의 값. [] 로 감싸 사용.
 *
 * [예시]
 * const AuthorSchema = new Schema({
 *   name: String,
 *   email: String,
 * });
 * const BookSchema = new Schema({
 *   title: String,
 *   description: String,
 *   authors: [AuthorSchema],
 *   meta: {
 *     likes: Number,
 *   },
 *   extra: Schema.Types.Mixed,
 * });
 *
 * [ 관계형 데이터 ]
 * MariaDB, PostgresSQL 등 관계형 데이터베이스에서는 데이터의 id 만 관계있는 데이터에 넣어주는 반면,
 * MongoDB 에서는 id와 필요한 데이터를 모두 관계있는 데이터({ _id, username })에 넣어 주어야 함.
 */
