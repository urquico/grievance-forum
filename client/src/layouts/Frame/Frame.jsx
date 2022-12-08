import React, { useEffect, useState } from "react";
import {
  AppShell,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";

import { logOut } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";
import NavBarLayout from "./NavBarLayout";
import AsideLayout from "./AsideLayout";

// includes the navigation, sidebar, responsive UI etc.

function Frame({ content, path }) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);
  const dark = colorScheme === "dark";

  useEffect(() => {
    // redirects to login page when accessing a url that requires authentication
    if (localStorage.getItem("name") === null) {
      navigate("/");
    } else {
      navigate(path);
      console.log(path);
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
        header={
          <HeaderLayout
            opened={opened}
            setOpened={setOpened}
            dark={dark}
            theme={theme}
            toggleColorScheme={toggleColorScheme}
          />
        }
        navbar={<NavBarLayout opened={opened} logOut={logout} />}
        aside={<AsideLayout />}
      >
        {content}
      </AppShell>
    </div>
  );
}

export default Frame;
