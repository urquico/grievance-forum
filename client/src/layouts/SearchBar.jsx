import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, useMantineTheme, Tooltip } from "@mantine/core";
import {
  IconSearch,
  IconHome,
  IconBallpen,
  IconAddressBook,
  IconExplicit,
  IconChartBar,
} from "@tabler/icons";
import {
  SpotlightProvider,
  openSpotlight,
  registerSpotlightActions,
} from "@mantine/spotlight";
import { getUser, getAllPosts, removeHTMLTags } from "../firebase-config";

function SearchBar() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setIsAdmin(result.isAdmin);
    });
  }, []);

  const actions = [
    {
      group: "search",
      title: "Home",
      description: "Go to home page",
      onTrigger: () => navigate("/home"),
      icon: <IconHome size={18} />,
    },
    {
      group: "search",
      title: "Post",
      description: "Write a concern",
      onTrigger: () => navigate("/post "),
      icon: <IconBallpen size={18} />,
    },
    {
      group: "search",
      title: "Profile",
      description: "Go to your posts and account information",
      onTrigger: () => navigate("/profile"),
      icon: <IconAddressBook size={18} />,
    },
  ];

  const searchQueries = () => {
    getAllPosts().then((result) => {
      result.docs.map((post) => {
        registerSpotlightActions([
          {
            group: "posts",
            id: post.id,
            title: post._document.data.value.mapValue.fields.isAnonymous
              .booleanValue
              ? "HARONYMOUS"
              : post._document.data.value.mapValue.fields.userId.stringValue,
            description: removeHTMLTags(
              post._document.data.value.mapValue.fields.message.stringValue
            ),
            onTrigger: () => navigate(`/comment/${post.id}`),
          },
        ]);
      });
    });
  };

  const checkIfHasAdminControls = () => {
    if (isAdmin) {
      registerSpotlightActions([
        {
          group: "admin",
          id: "profanities-admin",
          title: "Profanities",
          description: "Register a profane word",
          icon: <IconExplicit size={18} />,
          onTrigger: () => navigate("/profanities"),
        },
        {
          group: "admin",
          id: "reviews-admin",
          title: "Reviews",
          description: "View analytics",
          icon: <IconChartBar size={18} />,
          onTrigger: () => navigate("/Reviews"),
        },
      ]);
    }
  };

  return (
    <div>
      <SpotlightProvider
        limit={5}
        transitionDuration={300}
        transition="slide-down"
        actions={actions}
        searchIcon={<IconSearch size={18} />}
        searchPlaceholder="Search..."
        shortcut="/"
        nothingFoundMessage="Nothing found..."
      >
        <Tooltip label="Search">
          <ActionIcon
            style={{ margin: "0.400rem" }}
            variant="transparent"
            color={theme.colorScheme === "dark" ? "yellow" : "blue"}
            title="Toggle color scheme"
            onClick={() => {
              checkIfHasAdminControls();
              searchQueries();
              openSpotlight();
            }}
          >
            <IconSearch size={18} />
          </ActionIcon>
        </Tooltip>
      </SpotlightProvider>
    </div>
  );
}

export default SearchBar;
