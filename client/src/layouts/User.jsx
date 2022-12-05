import React from "react";
import { Avatar } from "@mantine/core";

function User({ publisher, isAnonymous, email }) {
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
  return (
    <div>
      {" "}
      <Avatar
        src={null}
        alt={publisher}
        color={avatarColors[Math.floor(Math.random() * avatarColors.length)]}
      >
        {isAnonymous ? "H" : email.toUpperCase()[0] + publisher[0]}
      </Avatar>
    </div>
  );
}

export default User;
