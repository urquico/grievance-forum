import React from "react";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import WritePostCard from "../layouts/WritePostCard";
import { useDocumentTitle } from "@mantine/hooks";

function Post() {
  useDocumentTitle(Post);
  return <Frame content={<PostLayout />} path={"/post"} />;
}

function PostLayout() {
  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`<br/>This is a safe place to share and express your thoughts, concerns, and grievances personally or academically.
  <br/><br/><i>Please <b>avoid the use of offensive language</b> that would make others uncomfortable. </i>
  <br/><br/>Let's make this platform fun and safe for everyone!
        `}
      />
      <WritePostCard />
    </div>
  );
}

export default Post;
