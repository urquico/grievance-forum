import React, { useState, useLayoutEffect } from "react";
import { IconBell, IconExclamationMark } from "@tabler/icons";
import {
  Menu,
  Text,
  ActionIcon,
  Indicator,
  useMantineColorScheme,
} from "@mantine/core";

function Notification() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const dark = colorScheme === "dark";

  return (
    <Indicator
      inline
      offset={12}
      size={20}
      color="red"
      withBorder
      label={notificationCount}
      dot={false}
      showZero={false}
      overflowCount={99}
    >
      <Menu
        shadow="md"
        width={200}
        style={{ zIndex: "100px", margin: "0.400rem" }}
        withArrow
        transition="rotate-right"
        transitionDuration={150}
      >
        <Menu.Target>
          <ActionIcon variant="transparent" color={dark ? "yellow" : "blue"}>
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
    </Indicator>
  );
}

export default Notification;
