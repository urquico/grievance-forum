import React from "react";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import WritePostCard from "../layouts/WritePostCard";

function Post() {
  return <Frame content={<PostLayout path={"/post"} />} />;
}

function PostLayout() {
  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"check mo muna bago mo ipost kasi bawal magdelete dto"}
      />
      <WritePostCard />
    </div>
  );
}

export default Post;
