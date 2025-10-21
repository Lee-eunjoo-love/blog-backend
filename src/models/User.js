import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

// #. 스키마 정의
const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// #. 비밀번호 암호화 인스턴스 메서드 (this 접근을 위해 function 함수 정의)
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

// #. 비밀번호 일치여부 검증 인스턴스 메서드 (this 접근을 위해 function 함수 정의)
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // #. true/false
};

// #. 회원 조회 스태틱 메서드 (this 는 모델 자신)
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// #. toJSON 변환 인스턴스 메서드 (this 접근을 위해 function 함수 정의)
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

// #. 모델 생성
const User = mongoose.model("User", UserSchema);

export default User;

/**
 * 모델 메서드 만들기 예
 * const user = new User({ username: 'velopert' });
 * user.setPassword('mypass123');
 */

/**
 * [ 세션 기반 인증 ]
 * 세션을 기반으로 인증 시스템을 만듬. (서버가 사용자 로그인 상태 정보 갖고 있음)
 * 세션 기반 인증의 단점은 서버 확장의 어려움. (여러 서버 인스턴스인 경우 모든 서버끼리 세션을 공유하도록 구성해야 하므로 세션 전용 DB 필요)
 * 1. 사용자가 로그인을 하면
 * 2. 서버는 세션 저장소에 사용자의 정보를 조회하고 세션 id 를 발급
 * 3. 발급된 id 는 주로 브라우저 쿠키에 저장.
 * 4. 사용자가 요청을 보낼때 서버는 세션 저장소에서 세션을 조회하여 로그인 여부를 결정하여 작업을 처리하고 응답. (세션 저장소는 주로 메모리, 디스크, DB 사용)
 *
 * [ 토큰 기반 인증 ]
 * 토큰 : 로그인 후 서버가 만들어 주는 '사용자의 로그인 정보와 해당 정보가 서버에서 발급되었음을 증명하는 서명을 포함한' 문자열.
 * 서명 데이터 : HMAC SHA256 또는 RSA SHA256 알고리즘 사용하여 만듦. 토큰 무결성(위변조되지 않음) 보장.
 * 토큰 기반 인증의 장점은 서버에서 사용자 로그인 정보를 기억하기 위해 사용하는 리소스가 적고, 사용자 쪽에서 로그인 상태를 지닌 토큰을 가지고 있으므로 서버의 확장성이 높음.
 * 1. 사용자가 로그인을 하면
 * 2. 서버는 사용자에게 해당 사용자의 정보를 지니는 토큰을 발급
 * 3. 로그인 상태를 담은 토큰은 사용자 쪽에 저장.
 * 4. 사용자가 요청을 보낼때 발급받은 토큰과 함께 요청하면 서버는 토큰이 유효한지 검사하고 결과에 따라 작업을 처리하고 응답.
 *
 * [ yarn add bcrypt ]
 * 단방향 해싱 함수를 지원해주는 라이브러리를 사용하여 주요 데이터를 암호화하여 저장.
 */
