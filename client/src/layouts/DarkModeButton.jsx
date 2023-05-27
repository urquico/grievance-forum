import React from "react";
import { ActionIcon, useMantineColorScheme, Tooltip } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";

function DarkModeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div>
      <Tooltip label={dark ? "Turn On" : "Turn Off"}>
        <ActionIcon style={{ margin: "0.400rem" }} variant="transparent" color={dark ? "yellow" : "blue"} onClick={() => toggleColorScheme()}>
          {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
      </Tooltip>
    </div>
  );
}

export default DarkModeButton;
