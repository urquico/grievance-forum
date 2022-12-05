import React, { useEffect, useState } from "react";
import {
  Button,
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconHome2,
  IconBallpen,
  IconAddressBook,
  IconCategory,
  IconTags,
} from "@tabler/icons";
import { logOut } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@emotion/react";

// includes the navigation, sidebar, responsive UI etc.

function Frame({ content }) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // redirects to login page when accessing a url that requires authentication
    if (localStorage.getItem("name") === null) {
      navigate("/");
    } else {
      navigate("/home");
    }
  }, [navigate]);

  const logout = () => {
    logOut();
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        header={<>Header</>}
      ></AppShell>
    </div>
  );
}
