import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import WritePostCard from "../layouts/WritePostCard";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";

function Post() {
  useDocumentTitle("Post");
  return <Frame content={<PostLayout />} path={"/post"} />;
}

function PostLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.userAgreedSLA) {
        navigate("/home");
      }
    });
  }, []);

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`<br/>This is a safe place to share and express your thoughts, concerns, and grievances.
  <br/><br/><i>Please <b>avoid the use of offensive language</b> that would make others uncomfortable. </i>
  <br/><br/>Let's make this platform fun and safe for everyone!
        `}
      />
      <WritePostCard />
    </div>
  );
}

export default Post;
