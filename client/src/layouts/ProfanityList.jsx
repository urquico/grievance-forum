import React, { useState, useLayoutEffect } from "react";
import { List, ActionIcon, Text } from "@mantine/core";
import { IconX } from "@tabler/icons";

import axios from "axios";
import { PORT } from "../Globals";

function ProfanityList({ badword }) {
  const [isHidden, setIsHidden] = useState(false);

  const deleteProfanity = () => {
    axios
      .post(`${PORT}/deleteProfanity`, { profanity: badword })
      .then((result) => {
        setIsHidden(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <List.Item
      icon={
        <ActionIcon
          color="red"
          size={20}
          radius="xl"
          variant="outline"
          onClick={deleteProfanity}
        >
          <IconX size={16} />
        </ActionIcon>
      }
      style={{ marginLeft: "0.750rem", display: isHidden ? "none" : "" }}
    >
      <Text fz="sm">{badword}</Text>
    </List.Item>
  );
}

export default ProfanityList;
