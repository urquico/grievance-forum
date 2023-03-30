import React, { useState } from "react";
import { useMantineTheme } from "@mantine/core";
import User from "../layouts/User";

function PendingPosts() {
  const theme = useMantineTheme();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{
        display: isVisible ? "none" : "flex",
        height: "auto",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],

        borderRadius: "13px",
        padding: "2.375rem",
        marginTop: "1rem",
        fontSize: "1.125rem",
        flexDirection: "column",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      <User
        publisher="Kurt Jacob E. Urquico"
        isAnonymous={false}
        email="kjeurquico@gmail.com"
        isAdmin={false}
        isCurrentUserAdmin={true}
        hideTrashAndBadge={false}
        previewOnly={false}
        postId=""
        tags={""}
        setIsVisible={setIsVisible}
        isComment={false}
        isPendingPost={true}
      />
    </div>
  );
}

export default PendingPosts;
