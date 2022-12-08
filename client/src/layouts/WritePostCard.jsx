import React, { useState } from "react";
import { useMantineTheme, Text, Switch, Select } from "@mantine/core";
import User from "./User";

function WritePostCard() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const theme = useMantineTheme();

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
      <PostAnonymously
        setIsAnonymous={setIsAnonymous}
        isAnonymous={isAnonymous}
      />
      <User
        publisher={localStorage.getItem("name")}
        isAnonymous={isAnonymous}
        email={localStorage.getItem("email")}
        isAdmin={""}
        isCurrentUserAdmin={false}
        hideTrashAndBadge={true}
      />
      <ChooseCategory isAnonymous={isAnonymous} />
    </div>
  );
}

function PostAnonymously({ setIsAnonymous, isAnonymous }) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? "#25262B" : "#f4f4f4",
        borderRadius: "4px",
        border: "1px solid",
        borderColor: theme.colorScheme === "dark" ? "#373A40" : "#CED4DA",
        display: "flex",
        padding: "0.75rem",
        marginBottom: "1rem",
      }}
    >
      <Text
        fz="sm"
        style={{
          marginLeft: "0",
          marginRight: "auto",
          marginTop: "0.3rem",
          color:
            theme.colorScheme === "dark" ? theme.colors.gray[6] : "#5E5F61",
        }}
      >
        Post Anonymously
      </Text>

      <Switch
        style={{
          marginTop: "-1rem",
        }}
        checked={isAnonymous}
        onChange={(event) => setIsAnonymous(event.currentTarget.checked)}
        labelPosition="left"
        onLabel="ANONYMOUS"
        offLabel={`YOU`}
        size="lg"
      />
    </div>
  );
}

function ChooseCategory({ isAnonymous }) {
  return (
    <>
      <Select
        style={{
          marginLeft: "2.90rem",
          width: "7.5rem",
          marginTop: isAnonymous ? "-0.75rem" : "0",
          // borderColor: "blue",
        }}
        placeholder="Category"
        data={[
          { value: "personal", label: "personal" },
          { value: "academic", label: "academic" },
        ]}
      />
    </>
  );
}

export default WritePostCard;
