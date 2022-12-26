import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconBell, IconExclamationMark, IconClock } from "@tabler/icons";
import {
  Menu,
  Text,
  ActionIcon,
  Indicator,
  useMantineColorScheme,
} from "@mantine/core";
import axios from "axios";

import { getNotifications } from "../../firebase-config";
import TagLoader from "../Loading/TagLoader";

function Notification() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [empty, isEmpty] = useState(false);
  const navigate = useNavigate();

  const dark = colorScheme === "dark";

  useLayoutEffect(() => {
    getNotifications(localStorage.getItem("email")).then((result) => {
      setNotificationCount(result.size);
    });
  }, []);

  const openNotification = () => {
    getNotifications(localStorage.getItem("email"))
      .then((result) => {
        if (!result?.empty) {
          setNotifications([
            ...result.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              readTime: doc._document.readTime.timestamp.seconds,
            })),
          ]);
          setIsLoading(false);
          setNotificationCount(result.size);
        } else {
          isEmpty(true);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  console.log(notifications);
  console.log(isLoading);
  console.log(empty);

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
        onOpen={openNotification}
        onClose={() => {
          setIsLoading(true);
          isEmpty(false);
        }}
        shadow="md"
        width={400}
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
          <Menu.Label>Unread Notifications</Menu.Label>
          {isLoading ? (
            <>
              <TagLoader />
              <TagLoader />
              <TagLoader />
              <TagLoader />
            </>
          ) : (
            <>
              {notifications?.map((notification) => {
                let timeDisplay = "";
                let cardVerb = "";
                let messageNotification = "";
                const timeCurrent = new Date(notification.readTime * 1000);
                const timePosted = new Date(
                  notification.notificationTime.seconds * 1000
                );

                const time =
                  (timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600;

                if (Math.floor(time) < 1) {
                  if (Math.floor(time * 60) <= 1) {
                    timeDisplay = `${cardVerb} ${Math.floor(
                      time * 60
                    )} minute ago`;
                  } else {
                    timeDisplay = `${cardVerb} ${Math.floor(
                      time * 60
                    )} minutes ago`;
                  }
                } else if (Math.floor(time) === 1) {
                  timeDisplay = `${cardVerb} ${Math.floor(time)} hour ago`;
                } else if (Math.floor(time) >= 2 && Math.floor(time) < 24) {
                  timeDisplay = `${cardVerb} ${Math.floor(time)} hours ago`;
                } else if (Math.floor(time) >= 24 && Math.floor(time) <= 48) {
                  timeDisplay = `${cardVerb} ${Math.floor(time / 24)} day ago`;
                } else if (Math.floor(time) > 48) {
                  timeDisplay = `${cardVerb} ${Math.floor(time / 24)} days ago`;
                }

                if (notification.notificationType === "reply") {
                  messageNotification = `${notification.notifier} replied to your post`;
                }
                if (!notification.isOpened) {
                  return (
                    <Menu.Item
                      onClick={() => {
                        navigate(`/comment/${notification.postId}`);
                      }}
                      icon={
                        <ActionIcon
                          variant="filled"
                          color="orange"
                          style={{ borderRadius: "50px" }}
                        >
                          <IconExclamationMark size={16} />
                        </ActionIcon>
                      }
                      rightSection={
                        <Text size="xs" color="dimmed">
                          <IconClock
                            size={14}
                            style={{ paddingTop: "0.250rem" }}
                          />
                          {timeDisplay}
                        </Text>
                      }
                    >
                      {messageNotification}
                    </Menu.Item>
                  );
                }

                return "";
              })}
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </Indicator>
  );
}

export default Notification;
