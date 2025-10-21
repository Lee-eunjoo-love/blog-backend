import Post from "./models/post.js";

export default function createFakeData() {
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: "〈우리가 빛이라 상상하는 모든 것〉은 나에겐 만든 사람이 궁금해지는 영화다. 인도에서 활동하는 여성 영화인 파얄 카파디아 감독이 각본/연출했다. 파얄 카파디아 감독은 다큐멘터리 연출로도 이름을 알린 감독이다. 뭄바이 출신인 감독은 픽션과 논픽션을 넘나들며 꾸준히 인도에 관한 이야기를 해왔다. 영화는 이렇게 시작한다. 기차에서 내려다 본 뭄바이의 거리 전경이 펼쳐지면, 그 거리에서 일하는 사람들의 모습 위에 익명의 사람들이 나레이션을 한다. 누군가에게 이야기하듯 자신이 뭄바이로 온 이유를 들려준다. 이들은 각기 돈을 벌기 위해, 억압적인 집안에서 벗어나기 위해, 꿈을 이루기 위해 뭄바이에 찾아왔다고 말한다.",
    tags: ["가짜", "데이터"],
  }));

  Post.insertMany(posts)
    .then(() => console.log("successfully saved FakeData"))
    .catch(console.log);
}
