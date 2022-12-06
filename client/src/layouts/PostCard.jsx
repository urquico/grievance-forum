import React, { useLayoutEffect, useState } from "react";
import { useMantineTheme, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import User from "./User";
import { getUser } from "../firebase-config";

function PostCard({ email, isAnonymous, tags, category }) {
  const theme = useMantineTheme();
  const [publisher, setPublisher] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(email).then((result) => {
      setPublisher(result.name);
      setIsAdmin(result.isAdmin); // check if the publisher is admin
    });
  }, [email]);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setIsCurrentUserAdmin(result.isAdmin);
    });
  }, []);

  return (
    <div
      style={{
        height: "auto",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        borderRadius: "13px",
        padding: "2.375rem",
        marginTop: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <User
        publisher={publisher}
        isAnonymous={isAnonymous}
        email={email}
        isAdmin={isAdmin}
        isCurrentUserAdmin={isCurrentUserAdmin}
      />
      <div style={{ marginTop: "0.063rem" }}>
        {/* Category */}
        <Badge
          variant="gradient"
          gradient={
            category === "academic-concerns"
              ? { from: "orange", to: "red" }
              : { from: "teal", to: "lime", deg: 105 }
          }
          style={{ marginLeft: "2.500rem", cursor: "pointer" }}
          onClick={() => {
            navigate(`/category/${category}`);
          }}
        >
          {category}
        </Badge>
        {/* Tags */}
        {tags.map((tag) => {
          return (
            <Badge
              size="xs"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              style={{ marginLeft: "0.250rem", cursor: "pointer" }}
              onClick={() => {
                navigate(`/tags/${tag}`);
              }}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

export default PostCard;
