import React, { useState, useLayoutEffect } from "react";
import { IconBell } from "@tabler/icons";
import { Menu, Button, Text, ActionIcon } from "@mantine/core";

function Notification() {
  return (
    <Menu
      shadow="md"
      width={200}
      style={{ zIndex: "100px", margin: "0.400rem" }}
      withArrow
      transition="rotate-right"
      transitionDuration={150}
    >
      <Menu.Target>
        <ActionIcon variant="transparent" color="blue">
          <IconBell size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconBell size={14} />}>Settings</Menu.Item>
        <Menu.Item icon={<IconBell size={14} />}>Messages</Menu.Item>
        <Menu.Item icon={<IconBell size={14} />}>Gallery</Menu.Item>
        <Menu.Item
          icon={<IconBell size={14} />}
          rightSection={
            <Text size="xs" color="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconBell size={14} />}>Transfer my data</Menu.Item>
        <Menu.Item color="red" icon={<IconBell size={14} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default Notification;
