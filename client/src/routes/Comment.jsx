import React, { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import PostCard from "../layouts/PostCard";
import LoadingPost from "../layouts/Loading/LoadingPost";
import { getSinglePost } from "../firebase-config";

function Comment() {
  let { id } = useParams();
  return <Frame content={<CommentLayout />} path={`/comment/${id}`} />;
}

function CommentLayout() {
  let { id } = useParams();
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeCurrent, setTimeCurrent] = useState(0);
  const [timePosted, setTimePosted] = useState(0);
  const [hour, setHour] = useState(0);

  useLayoutEffect(() => {
    getSinglePost(id).then((result) => {
      setPost({
        ...result.data(),
        id: result.id,
        readTime: result._document.readTime.timestamp.seconds,
      });
      setIsLoading(false);
      setTimeCurrent(new Date(post.readTime * 1000));
      setTimePosted(new Date(post.timePosted.seconds * 1000));
      setHour((timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600);
    });
  }, []);

  console.log(post);
  console.log(isLoading);

  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={id} />
      {isLoading ? (
        <LoadingPost />
      ) : (
        <>
          <PostCard
            isAnonymous={post.isAnonymous}
            email={post.userId}
            tags={post.tags}
            category={post.categoryId}
            time={hour.toLocaleString()}
            post={post.message}
            postId={id}
            isSolved={post.isSolved}
            voteNumber={post.upVote - post.downVote}
            previewOnly={false}
          />
        </>
      )}
    </div>
  );
}

export default Comment;
