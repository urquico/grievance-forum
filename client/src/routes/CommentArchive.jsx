import React, { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import PostCard from "../layouts/PostCard";
import LoadingPost from "../layouts/Loading/LoadingPost";
import { getSinglePost, getComments, checkSolveState } from "../firebase-config";
import { useMantineTheme, Timeline } from "@mantine/core";

import EndPost from "../layouts/EndPost";

import { useDocumentTitle } from "@mantine/hooks";

function CommentArchive() {
  let { id } = useParams();
  useDocumentTitle("Comments");
  return <Frame content={<CommentArchiveLayout />} path={`/comment/archive/${id}`} />;
}

function CommentArchiveLayout() {
  let { id } = useParams();
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isSolve, setIsSolve] = useState();
  let timeCurrent = 0,
    timePosted = 0,
    hour = 0;

  const theme = useMantineTheme();

  useLayoutEffect(() => {
    getSinglePost(id, "Archive").then((result) => {
      setPost({
        ...result.data(),
        id: result.id,
        readTime: result._document.readTime.timestamp.seconds,
      });
      setIsLoading(false);
    });
  }, [id]);

  useLayoutEffect(() => {
    checkSolveState(id).then((result) => {
      setIsSolve(result);
    });
  }, [id]);

  useLayoutEffect(() => {
    getComments(id).then((result) => {
      commentState(result);
      setIsCommentsLoading(false);
    });
  }, [id]);

  const generateTime = () => {
    timeCurrent = new Date(post?.readTime * 1000);
    timePosted = new Date(post?.timePosted?.seconds * 1000);

    hour = (timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600;

    return hour;
  };

  const commentState = (result) => {
    const isCollectionEmpty = result.size === 0;
    if (!isCollectionEmpty) {
      setComments(result);
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`<br/>Welcome to the comment section. <br/> <i>Please <b>avoid the use of offensive language</b> that would make others uncomfortable. </i>
`}
      />
      {isLoading ? (
        <>
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            height: "auto",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
            borderRadius: "13px",
            padding: "2.375rem",
            marginTop: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            flexDirection: "column",
          }}
        >
          <PostCard
            isAnonymous={post.isAnonymous}
            email={post.userId}
            tags={post.tags}
            category={post.categoryId}
            time={generateTime().toLocaleString()}
            post={post.message}
            postId={id}
            isSolved={isSolve}
            voteNumber={post.upVote - post.downVote}
            previewOnly={false}
            isComment={false}
            isArchive={true}
          />

          <div>
            {isEmpty ? (
              <EndPost content="No comments yet" />
            ) : (
              <>
                {isCommentsLoading ? (
                  <>
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                  </>
                ) : (
                  <Timeline>
                    {comments?.map((comment, index) => {
                      const timeCurrent = new Date(comment.readTime * 1000);
                      const timeCommented = new Date(comment.timeCommented.seconds * 1000);

                      const hour = (timeCurrent.getTime() - timeCommented.getTime()) / 1000 / 3600;

                      return (
                        <Timeline.Item key={index}>
                          <PostCard
                            style={{ marginLeft: "2rem" }}
                            isAnonymous={false}
                            email={comment.userId}
                            tags={[]}
                            category={""}
                            time={hour.toLocaleString()}
                            post={comment.reply}
                            postId={comment.id}
                            isSolved={false}
                            voteNumber={0}
                            previewOnly={false}
                            isComment={true}
                          />
                        </Timeline.Item>
                      );
                    })}
                    <Timeline.Item></Timeline.Item>
                  </Timeline>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentArchive;
