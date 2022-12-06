import React from "react";
import {
  Avatar,
  Text,
  useMantineTheme,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";

function User({ publisher, isAnonymous, email, isAdmin, isCurrentUserAdmin }) {
  const theme = useMantineTheme();
  const avatarColors = [
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "orange",
  ];

  const deletePost = () => {};
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Avatar
        src={null}
        alt={publisher}
        color={avatarColors[Math.floor(Math.random() * avatarColors.length)]}
      >
        {isAnonymous ? "H" : email.toUpperCase()[0] + publisher[0]}
      </Avatar>
      <Text
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          marginLeft: "0.563rem",
        }}
      >
        {isAnonymous ? "Anonymous" : publisher}
        <Text
          style={{
            fontSize: "0.750rem",
            color:
              theme.colorScheme === "dark" ? theme.colors.gray[6] : "#747678",
            position: "relative",
            top: "-0.438rem",
          }}
        >
          {isAnonymous ? "" : email}
        </Text>
      </Text>
      {isAnonymous ? (
        <Badge style={{ marginLeft: "5px" }} color="red">
          Anonymous
        </Badge>
      ) : (
        <Badge style={{ marginLeft: "5px" }} color={isAdmin ? "blue" : "green"}>
          {isAdmin ? "Admin" : "Student"}
        </Badge>
      )}
      <div style={{ margin: "auto", marginRight: "1rem" }}>
        {"kurt" === email || isCurrentUserAdmin ? (
          <ActionIcon>
            <IconTrash onClick={deletePost} />
          </ActionIcon>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default User;
