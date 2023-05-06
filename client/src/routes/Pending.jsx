/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser, getAllPendingPosts } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import PendingPosts from "../layouts/PendingPosts";
import IntroductionCard from "../layouts/IntroductionCard";
import LoadingPost from "../layouts/Loading/LoadingPost";
import EndPost from "../layouts/EndPost";

function Pending() {
  useDocumentTitle("Pending");
  return <Frame content={<PendingLayout />} path={"/pending"} />;
}

function PendingLayout() {
  const navigate = useNavigate();
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    getAllPendingPosts().then((result) => {
      setPendingPosts(() => [
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          readTime: doc._document.readTime.timestamp.seconds,
        })),
      ]);
      setIsLoading(false);
    });
  }, []);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  return (
    <>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Admin ka so pwede ka mag approve or decline ng posts"}
      />

      {isLoading ? (
        <>
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
        </>
      ) : (
        <>
          {pendingPosts?.map((post, index) => {
            const timeCurrent = new Date(post.readTime * 1000);
            const timePosted = new Date(post.timePosted.seconds * 1000);

            const hour =
              (timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600;

            return (
              <div key={index}>
                <PendingPosts
                  post={post.message}
                  email={post.userId}
                  time={hour}
                  isAnonymous={post.isAnonymous}
                  category={post.categoryId}
                  tags={post.tags}
                  postId={post.id}
                  collegeId={post.college}
                  program={post.program}
                  receiver={post.receiver}
                />
              </div>
            );
          })}
        </>
      )}

      {pendingPosts.length === 0 ? (
        <EndPost content="No content available" />
      ) : pendingPosts ? (
        <>
          <EndPost content="You've reached the end" />
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Pending;
