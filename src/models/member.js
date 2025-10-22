import mongoose from "mongoose";

const { Schema } = mongoose;

// #. 스키마 정의
const MemberSchema = new Schema({
  name: String,
  role: String,
  photo: String,
  desc: String,
  insta: String,
  facebook: String,
  youtube: String,
});

// #. 모델 생성
const Member = mongoose.model("Member", MemberSchema);
export default Member;
